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
const bcrypt = require("bcrypt");
const sequelize_2 = require("sequelize");
const jobs_service_1 = require("../jobs/jobs.service");
let AuthService = class AuthService {
    jwtService;
    userModel;
    profileModel;
    jobsService;
    constructor(jwtService, userModel, profileModel, jobsService) {
        this.jwtService = jwtService;
        this.userModel = userModel;
        this.profileModel = profileModel;
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
            ],
        }))?.toJSON();
        if (!user)
            throw new common_1.NotFoundException('Usuario inexistente');
        const result = {
            username: user.username,
            email: user.email,
            ...user.profile,
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
    async firstLogin(internal_user_id, dto) {
        const dbUser = await this.userModel.findByPk(internal_user_id);
        if (!dbUser)
            throw new common_1.NotFoundException('Usuario no encontrado');
        if (dto.password !== dto.confirmPassword) {
            throw new common_1.BadRequestException('Las contraseñas no coinciden');
        }
        if (dbUser.firstLogin === false) {
            throw new common_1.BadRequestException('El usuario ya realizó el primer login');
        }
        const newHash = await bcrypt.hash(dto.password, 10);
        dbUser.password = newHash;
        dbUser.firstLogin = false;
        await dbUser.save();
        return { message: 'Contraseña establecida correctamente en primer login' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, sequelize_1.InjectModel)(user_entity_1.User)),
    __param(2, (0, sequelize_1.InjectModel)(profile_entity_1.Profile)),
    __metadata("design:paramtypes", [jwt_1.JwtService, Object, Object, jobs_service_1.JobsService])
], AuthService);
//# sourceMappingURL=auth.service.js.map