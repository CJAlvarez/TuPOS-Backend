"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const sequelize_1 = require("@nestjs/sequelize");
const user_entity_1 = require("../entities/user.entity");
const profile_entity_1 = require("../entities/profile.entity");
const admin_entity_1 = require("../entities/admin.entity");
const store_entity_1 = require("../entities/store.entity");
const bcrypt = require("bcrypt");
const files_paths_1 = require("../utils/files.paths");
const sequelize_2 = require("sequelize");
const jobs_service_1 = require("../jobs/jobs.service");
const fs_1 = require("fs");
const path_1 = require("path");
let AuthService = class AuthService {
    jwtService;
    userModel;
    profileModel;
    adminModel;
    storeModel;
    jobsService;
    constructor(jwtService, userModel, profileModel, adminModel, storeModel, jobsService) {
        this.jwtService = jwtService;
        this.userModel = userModel;
        this.profileModel = profileModel;
        this.adminModel = adminModel;
        this.storeModel = storeModel;
        this.jobsService = jobsService;
    }
    async getUserData(id_user) {
        const user = (await this.userModel.findOne({
            where: { id: id_user },
            attributes: ['username', 'email'],
            include: [
                {
                    model: profile_entity_1.Profile,
                    as: 'profile',
                },
                {
                    model: admin_entity_1.Admin,
                    as: 'admin',
                    include: [
                        {
                            model: store_entity_1.Store,
                            as: 'store',
                            attributes: ['id', 'name', 'code', 'theme_config'],
                        },
                    ],
                },
            ],
        }))?.toJSON();
        if (!user)
            throw new common_1.NotFoundException('Usuario inexistente');
        const storeData = user.admin?.store || null;
        const result = {
            username: user.username,
            email: user.email,
            id_admin_type: user.admin ? user.admin.id_admin_type : null,
            ...user.profile,
            store: storeData,
        };
        return result;
    }
    async validateUser(username, password) {
        const user = await this.userModel.findOne({ where: { username } });
        if (!user)
            return null;
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return null;
        const { password: _pw, ...result } = user.toJSON();
        return result;
    }
    async login(loginDto) {
        const user = (await this.userModel.findOne({
            where: {
                [sequelize_2.Op.or]: [
                    { username: loginDto.username },
                    { email: loginDto.username },
                ],
            },
            include: [
                {
                    model: this.profileModel,
                    as: 'profile',
                },
            ],
        }))?.toJSON();
        if (!user)
            throw new common_1.UnauthorizedException({
                title: 'Correo o contraseña incorrecta',
                message: 'Vuelva a intentarlo.',
                status: 401,
                code: 'user',
            });
        const isMatch = await bcrypt.compare(loginDto.password, user.password);
        if (!isMatch)
            throw new common_1.UnauthorizedException({
                title: 'Correo o contraseña incorrecta',
                message: 'Vuelva a intentarlo.',
                status: 401,
                code: 'password',
            });
        if (user.disabledAt)
            throw new common_1.UnauthorizedException({
                title: 'Cuenta deshabilitada',
                message: 'Contacta al administrador.',
                status: 403,
                code: 'disabled',
            });
        const payload = {
            username: user.username,
            id_user: user.id,
            name: user.profile?.firstname,
        };
        return {
            token: this.jwtService.sign(payload),
            first_login: user.firstLogin,
            id: user.id,
        };
    }
    async changePassword(internal_user_id, dto) {
        const dbUser = await this.userModel.findByPk(internal_user_id);
        if (!dbUser)
            throw new common_1.NotFoundException('Usuario no encontrado');
        if (dto.password !== dto.confirm_password) {
            throw new common_1.BadRequestException('Las contraseñas no coinciden.');
        }
        const isMatch = await bcrypt.compare(dto.current_password, dbUser.getDataValue('password'));
        if (!isMatch)
            throw new common_1.BadRequestException('La contraseña actual no es válida.');
        const newHash = await bcrypt.hash(dto.password, 10);
        dbUser.set({ password: newHash });
        await dbUser.save();
        return { message: 'Contraseña cambiada correctamente.' };
    }
    async recoverPassword(dto) {
        const user = await this.userModel.findOne({ where: { email: dto.email } });
        if (!user)
            throw new common_1.BadRequestException('El correo no está registrado');
        const _user = user.toJSON();
        const token = this.jwtService.sign({ sub: _user.id }, { expiresIn: '1h' });
        user.setDataValue('restoreCode', token);
        await user.save();
        await this.jobsService.addJob({
            type: 'sendEmailTemplate',
            data: {
                to: _user.email,
                subject: 'Recupera tu Cuenta',
                replacements: {
                    logo_dark: 'https://tuposhn.com/assets/images/logo-dark2-sm.png',
                    logo_light: 'https://tuposhn.com/assets/images/logotipo-blanco.png',
                    content: [
                        { type: 'title', text: '¿Problemas con tu contraseña?' },
                        { type: 'skip' },
                        { type: 'skip' },
                        {
                            type: 'normal',
                            text: 'No te preocupes, crea una nueva contraseña y continúa moviéndote.',
                        },
                        { type: 'skip' },
                        {
                            type: 'button',
                            text: 'NUEVA CONTRASEÑA',
                            ref: `${process.env.FRONTEND_URL}/reset-password/${token}`,
                        },
                        { type: 'skip' },
                        { type: 'skip' },
                        { type: 'bold', text: '¿No sabes de lo que hablo?' },
                        { type: 'skip' },
                        {
                            type: 'normal',
                            text: 'Ignora este correo. Tu contraseña continuará siendo la misma.',
                        },
                    ],
                },
            },
        });
        return {
            title: 'Recuperación de cuenta.',
            message: `Se ha enviado un enlace de recuperación a <code> ${_user.email}</code>.<br>Este será válido por ${process.env.RECOVERY_TOKEN_INTERVAL} hora(s).`,
            code: 'recovery_password',
        };
    }
    async resetPassword(dto) {
        const user = await this.userModel.findOne({
            where: { restoreCode: dto.token, email: dto.email },
        });
        if (!user)
            throw new common_1.BadRequestException('Token inválido');
        const newHash = await bcrypt.hash(dto.password, 10);
        user.password = newHash;
        user.restoreCode = null;
        await user.save();
        return {
            title: 'Recuperación de cuenta.',
            message: 'Se ha restaurado tu contraseña con exito.',
            code: 'reset_password',
        };
    }
    async firstLogin(internal_user_id, dto, avatar) {
        const dbUser = await this.userModel.findByPk(internal_user_id);
        if (!dbUser)
            throw new common_1.NotFoundException({
                title: 'Usuario no encontrado',
                message: 'La sesión no corresponde a un usuario válido.',
                status: 404,
                code: 'user',
            });
        const confirmation = dto.confirm ?? dto.confirmPassword;
        if (!confirmation)
            throw new common_1.BadRequestException({
                title: 'Confirmación requerida',
                message: 'Debes confirmar la nueva contraseña.',
                status: 400,
                code: 'confirm',
            });
        if (dto.password !== confirmation)
            throw new common_1.BadRequestException({
                title: 'Las contraseñas no coinciden',
                message: 'Verifica la nueva contraseña y su confirmación.',
                status: 400,
                code: 'password',
            });
        if (dbUser.firstLogin === false)
            throw new common_1.BadRequestException({
                title: 'Primer inicio ya completado',
                message: 'Este usuario ya realizó su primer inicio de sesión.',
                status: 400,
                code: 'first_login',
            });
        const newHash = await bcrypt.hash(dto.password, 10);
        dbUser.set({ password: newHash, firstLogin: false });
        await dbUser.save();
        const profile = await this.saveFirstLoginProfile(Number(dbUser.getDataValue('id')), dto, avatar);
        const user = dbUser.toJSON();
        return {
            token: this.jwtService.sign({
                username: user.username,
                id_user: user.id,
                name: profile?.firstname ?? null,
            }),
            first_login: false,
            id: user.id,
        };
    }
    async saveFirstLoginProfile(id_user, dto, avatar) {
        const changes = {};
        const firstname = dto.firstname?.trim();
        if (firstname)
            changes.firstname = firstname;
        const lastname = dto.lastname?.trim();
        if (lastname)
            changes.lastname = lastname;
        const phone = dto.phone?.trim();
        if (phone)
            changes.phone = phone;
        const id_gender = Number.parseInt(dto.gender ?? '', 10);
        if (Number.isFinite(id_gender))
            changes.id_gender = id_gender;
        const image = await this.storeProfileImage(id_user, dto.src, avatar);
        if (image)
            changes.image = image;
        let profile = await this.profileModel.findOne({ where: { id_user } });
        if (!profile) {
            profile = await this.profileModel.create({
                id_user,
                firstname: changes.firstname ?? '',
                lastname: changes.lastname ?? '',
                id_gender: changes.id_gender ?? null,
                phone: changes.phone ?? '',
                image: changes.image ?? '',
            });
            return profile;
        }
        if (Object.keys(changes).length) {
            changes.updated_at = new Date();
            await profile.update(changes);
        }
        return profile;
    }
    async storeProfileImage(id_user, src, avatar) {
        const MAX_BYTES = 2 * 1024 * 1024;
        let buffer = null;
        let extension = '';
        if (avatar?.buffer?.length) {
            if (!avatar.mimetype?.startsWith('image/')) {
                throw new common_1.BadRequestException({
                    title: 'Archivo no válido',
                    message: 'La foto de perfil debe ser una imagen.',
                    status: 400,
                    code: 'image',
                });
            }
            buffer = avatar.buffer;
            extension =
                (0, path_1.extname)(avatar.originalname ?? '').toLowerCase() ||
                    `.${avatar.mimetype.split('/')[1]}`;
        }
        else if (src?.startsWith('data:image/')) {
            const match = /^data:image\/([a-zA-Z0-9.+-]+);base64,(.+)$/.exec(src);
            if (!match)
                return null;
            buffer = Buffer.from(match[2], 'base64');
            extension = `.${match[1]}`;
        }
        else {
            const plain = src?.trim();
            return plain ? plain : null;
        }
        if (buffer.length > MAX_BYTES) {
            throw new common_1.BadRequestException({
                title: 'Archivo demasiado grande',
                message: 'La foto de perfil no puede superar los 2 MB.',
                status: 400,
                code: 'image',
            });
        }
        const filename = `profile-${id_user}-${Date.now()}${extension}`;
        await fs_1.promises.mkdir(files_paths_1.PROFILE_IMAGES_DIR, { recursive: true });
        await fs_1.promises.writeFile((0, path_1.join)(files_paths_1.PROFILE_IMAGES_DIR, filename), buffer);
        return filename;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, sequelize_1.InjectModel)(user_entity_1.User)),
    __param(2, (0, sequelize_1.InjectModel)(profile_entity_1.Profile)),
    __param(3, (0, sequelize_1.InjectModel)(admin_entity_1.Admin)),
    __param(4, (0, sequelize_1.InjectModel)(store_entity_1.Store)),
    __metadata("design:paramtypes", [jwt_1.JwtService, Object, Object, Object, Object, jobs_service_1.JobsService])
], AuthService);
//# sourceMappingURL=auth.service.js.map