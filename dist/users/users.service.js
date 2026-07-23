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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const user_entity_1 = require("../entities/user.entity");
const profile_entity_1 = require("../entities/profile.entity");
const admin_entity_1 = require("../entities/admin.entity");
const sequelize_2 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const utils_service_1 = require("../utils/utils.service");
const bcrypt = require("bcrypt");
const jobs_service_1 = require("../jobs/jobs.service");
let UsersService = class UsersService {
    userModel;
    profileModel;
    adminModel;
    jobsService;
    utilsService;
    sequelize;
    constructor(userModel, profileModel, adminModel, jobsService, utilsService, sequelize) {
        this.userModel = userModel;
        this.profileModel = profileModel;
        this.adminModel = adminModel;
        this.jobsService = jobsService;
        this.utilsService = utilsService;
        this.sequelize = sequelize;
    }
    async findAll(query) {
        const { search_word, limit = 10, skip = 0 } = query;
        const where = {};
        if (search_word) {
            where[sequelize_2.Op.or] = [
                { '$profile.identification$': { [sequelize_2.Op.like]: `%${search_word}%` } },
                { '$profile.phone$': { [sequelize_2.Op.like]: `%${search_word}%` } },
                { '$user.email$': { [sequelize_2.Op.like]: `%${search_word}%` } },
                this.sequelize.literal(`MATCH(profile.firstname, profile.lastname) AGAINST('${search_word
                    .trim()
                    .replace(/'/g, "''")}' IN BOOLEAN MODE)`),
            ];
        }
        const include = [
            {
                model: user_entity_1.User,
                as: 'user',
                required: true,
                attributes: { exclude: ['password'] },
            },
            { model: profile_entity_1.Profile, as: 'profile', required: true },
        ];
        const total = await this.adminModel.count({ include, where });
        const paginate = this.utilsService.paginate(limit, skip, total, false);
        const rows = await this.adminModel.findAll({
            include,
            where,
            limit: paginate.limit,
            offset: paginate.offset,
        });
        return {
            count: total,
            list: rows.map((row) => row.toJSON()),
            skip: paginate.skip,
        };
    }
    async create(internal_user_id, dto) {
        const { user, profile, id_admin_type } = dto;
        if (!user || !profile)
            throw new common_1.BadRequestException('Datos incompletos');
        if (!user.password) {
            throw new common_1.BadRequestException('La contraseña es obligatoria');
        }
        const existing = await this.userModel.findOne({
            where: { email: user.email },
        });
        if (existing) {
            throw new common_1.BadRequestException('El email ya está registrado');
        }
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser = await this.userModel.create({
            username: user.email,
            password: hashedPassword,
            email: user.email,
            firstLogin: true,
            steps2: false,
            created_by: internal_user_id,
        });
        await this.adminModel.create({
            id_user: newUser.id,
            id_admin_type: id_admin_type ?? 2,
        });
        await this.profileModel.create({
            id_user: newUser.id,
            firstname: profile.firstname,
            lastname: profile.lastname,
            id_gender: profile.id_gender,
            id_country: profile.id_country,
            phone: profile.phone,
            identification: profile.identification,
            address: profile.address || '',
            image: profile.image || '',
        });
        await this.jobsService.addJob({
            type: 'sendEmail',
            data: {
                to: newUser.email,
                subject: 'Bienvenido a la plataforma',
                html: `<p>Hola ${profile.firstname}, tu usuario administrador ha sido creado correctamente.</p>`,
            },
        });
        return {
            title: 'Operación Exitosa',
            message: 'El administrador ha sido creado.',
            id_user: newUser.id,
        };
    }
    async update(internal_user_id, dto) {
        const id_user = dto?.user?.id;
        if (!id_user)
            throw new common_1.BadRequestException('Usuario no especificado');
        const user = await this.userModel.findByPk(id_user);
        if (!user)
            throw new common_1.NotFoundException('Usuario no encontrado');
        if (dto.user?.email) {
            await user.update({ email: dto.user.email });
        }
        if (dto.profile) {
            await this.profileModel.update({
                firstname: dto.profile.firstname,
                lastname: dto.profile.lastname,
                id_gender: dto.profile.id_gender,
                id_country: dto.profile.id_country,
                phone: dto.profile.phone,
                identification: dto.profile.identification,
                address: dto.profile.address,
                updated_at: new Date(),
            }, { where: { id_user } });
        }
        if (dto.id_admin_type) {
            const admin = await this.adminModel.findByPk(id_user);
            if (admin)
                await admin.update({ id_admin_type: dto.id_admin_type });
        }
        return {
            title: 'Operación Exitosa',
            message: 'El administrador ha sido actualizado.',
        };
    }
    async remove(internal_user_id, dto) {
        const user = await this.userModel.findByPk(dto.id_user);
        if (!user)
            throw new common_1.NotFoundException('Usuario no encontrado');
        await user.update({ disabledAt: new Date(), disabledBy: internal_user_id });
        const admin = await this.adminModel.findByPk(user.id);
        if (admin)
            await admin.update({
                deleted_at: new Date(),
                deleted_by: internal_user_id,
            });
        const profile = await this.profileModel.findOne({
            where: { id_user: user.id },
        });
        if (profile)
            await profile.update({ updated_at: new Date() });
        return { message: 'Administrador eliminado' };
    }
    async setEnableUser(internal_user_id, dto) {
        const admin = await this.adminModel.findByPk(dto.id_user);
        if (!admin)
            throw new common_1.NotFoundException('Admin no encontrado');
        await admin.update({
            disabled_at: dto.enable ? null : new Date(),
            disabled_by: dto.enable ? null : internal_user_id,
        });
        return {
            message: `Usuario ${dto.enable ? 'habilitado' : 'deshabilitado'}`,
        };
    }
    async setUserStatus(internal_user_id, body) {
        if (!body ||
            typeof body.id !== 'number' ||
            typeof body.enable !== 'boolean') {
            throw new common_1.BadRequestException('Datos incompletos.');
        }
        const admin = await this.adminModel.findByPk(body.id);
        if (!admin)
            throw new common_1.NotFoundException('Admin no encontrado');
        await admin.update({
            disabled_at: body.enable ? null : new Date(),
            disabled_by: body.enable ? null : internal_user_id,
        });
        return {
            title: 'Operación Exitosa',
            message: `El administrador ha sido ${body.enable ? 'Habilitado' : 'Deshabilitado'}.`,
        };
    }
    async recoverUserPassword(id_user, options) {
        if (!id_user)
            throw new common_1.BadRequestException('User not selected');
        const user = await this.userModel.findByPk(id_user, {
            include: [{ model: this.profileModel }],
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        let newPassword = options.password;
        if (options.secret) {
            newPassword = this.utilsService.generateToken(8, 2);
        }
        if (!newPassword)
            throw new common_1.BadRequestException('Password is required');
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashedPassword });
        await this.jobsService.addJob({
            type: 'sendEmail',
            data: {
                to: user.getDataValue('email'),
                subject: `Contraseña Restaurada por Administrador`,
                replacements: {
                    logo_dark: 'https://tuposhn.com/assets/images/logo-dark2-sm.png',
                    logo_light: 'https://tuposhn.com/assets/images/logotipo-blanco.png',
                    content: [
                        {
                            type: 'normal',
                            text: `Hola, ${user.getDataValue('profile')?.firstname || ''} ${user.getDataValue('profile')?.lastname || ''}`,
                        },
                        { type: 'skip' },
                        { type: 'skip' },
                        {
                            type: 'normal',
                            text: `Tu contraseña ha sido restaurada manualmente por un Administrador.`,
                        },
                        { type: 'skip' },
                        { type: 'skip' },
                        {
                            type: 'bold',
                            text: 'Nueva Contraseña: ',
                        },
                        {
                            type: 'normal',
                            text: newPassword,
                        },
                        { type: 'skip' },
                        { type: 'skip' },
                        {
                            type: 'small',
                            text: '¿Tienes problemas iniciando sesión? Respóndenos a este mail y te ayudaremos.',
                        },
                    ],
                },
            },
        });
        return {
            title: 'Operación Exitosa.',
            message: `La contraseña ha sido restaurada. ${options.secret ? '' : newPassword}`,
        };
    }
    async getUserAccesses(id_user) {
        const admin = await this.adminModel.findByPk(id_user);
        return {
            admin: !!admin,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(user_entity_1.User)),
    __param(1, (0, sequelize_1.InjectModel)(profile_entity_1.Profile)),
    __param(2, (0, sequelize_1.InjectModel)(admin_entity_1.Admin)),
    __metadata("design:paramtypes", [Object, Object, Object, jobs_service_1.JobsService,
        utils_service_1.UtilsService,
        sequelize_typescript_1.Sequelize])
], UsersService);
//# sourceMappingURL=users.service.js.map