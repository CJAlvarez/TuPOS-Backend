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
const client_entity_1 = require("../entities/client.entity");
const profile_entity_1 = require("../entities/profile.entity");
const admin_entity_1 = require("../entities/admin.entity");
const sequelize_2 = require("sequelize");
const utils_service_1 = require("../utils/utils.service");
const bcrypt = require("bcrypt");
const jobs_service_1 = require("../jobs/jobs.service");
let UsersService = class UsersService {
    userModel;
    clientModel;
    profileModel;
    adminModel;
    jobsService;
    utilsService;
    constructor(userModel, clientModel, profileModel, adminModel, jobsService, utilsService) {
        this.userModel = userModel;
        this.clientModel = clientModel;
        this.profileModel = profileModel;
        this.adminModel = adminModel;
        this.jobsService = jobsService;
        this.utilsService = utilsService;
    }
    async findAll(query) {
        const { email, firstname, lastname, skip = 0, take = 20 } = query;
        const where = {};
        if (email)
            where.email = { [sequelize_2.Op.iLike]: `%${email}%` };
        if (firstname)
            where.firstname = { [sequelize_2.Op.iLike]: `%${firstname}%` };
        if (lastname)
            where.lastname = { [sequelize_2.Op.iLike]: `%${lastname}%` };
        const { count, rows } = await this.userModel.findAndCountAll({
            where,
            offset: Number(skip),
            limit: Number(take),
        });
        return { count, list: rows, skip: Number(skip) };
    }
    async create(internal_user_id, dto) {
        const existing = await this.userModel.findOne({
            where: { email: dto.email },
        });
        if (existing) {
            throw new common_1.BadRequestException('El email ya está registrado');
        }
        if (!dto.password) {
            throw new common_1.BadRequestException('La contraseña es obligatoria');
        }
        const user = await this.userModel.create({
            username: dto.email,
            password: dto.password,
            email: dto.email,
            firstLogin: true,
            steps2: false,
            created_by: internal_user_id,
        });
        const client = this.clientModel.build({ id_user: user.id });
        await client.save();
        if (dto.id_admin_type === 1) {
            const admin = this.adminModel.build({
                id_user: user.id,
                id_admin_type: 1,
            });
            await admin.save();
        }
        const profile = this.profileModel.build({
            id_user: user.id,
            firstname: dto.firstname,
            lastname: dto.lastname,
            id_gender: dto.id_gender,
            id_country: dto.id_country,
            phone: dto.phone,
            identification: dto.identification,
            address: '',
            image: '',
        });
        await profile.save();
        await this.jobsService.addJob({
            type: 'sendEmail',
            data: {
                to: user.email,
                subject: 'Bienvenido a la plataforma',
                html: `<p>Hola ${dto.firstname}, tu usuario ha sido creado correctamente.</p>`,
            },
        });
        return user;
    }
    async update(internal_user_id, dto) {
        const user = await this.userModel.findByPk(internal_user_id);
        if (!user)
            throw new common_1.NotFoundException('Usuario no encontrado');
        const updatedUser = await user.update({
            email: dto.email,
        });
        const profile = await this.profileModel.findOne({
            where: { id_user: internal_user_id },
        });
        if (profile) {
            await profile.update({
                firstname: dto.firstname,
                lastname: dto.lastname,
                id_gender: dto.id_gender,
                id_country: dto.id_country,
                phone: dto.phone,
                identification: dto.identification,
                updated_at: new Date(),
            });
        }
        const admin = await this.adminModel.findByPk(internal_user_id);
        if (admin && dto.id_admin_type) {
            await admin.update({ id_admin_type: dto.id_admin_type });
        }
        return {
            title: 'Operación Exitosa',
            message: 'Su perfil ha sido actualizado.',
        };
    }
    async remove(internal_user_id, dto) {
        const user = await this.userModel.findByPk(dto.id_user);
        if (!user)
            throw new common_1.NotFoundException('Usuario no encontrado');
        await user.update({ disabledAt: new Date(), disabledBy: internal_user_id });
        const client = await this.clientModel.findByPk(user.id);
        if (client)
            await client.update({
                deleted_at: new Date(),
                deleted_by: internal_user_id,
            });
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
        return { message: 'Usuario eliminado' };
    }
    async setEnableUser(internal_user_id, dto) {
        const admin = await this.adminModel.findByPk(dto.id_user);
        if (!admin)
            throw new common_1.NotFoundException('Admin no encontrado');
        await admin.update({
            disabled_at: dto.enable ? undefined : new Date(),
            disabled_by: internal_user_id,
        });
        return {
            message: `Usuario ${dto.enable ? 'habilitado' : 'deshabilitado'}`,
        };
    }
    async setUserAdmin(id_user) {
        const exists = await this.adminModel.findByPk(id_user);
        if (exists)
            return { message: 'Ya es admin' };
        await this.adminModel.create({ id_user, id_admin_type: 1 });
        return { message: 'Usuario convertido a admin' };
    }
    async setUserClient(id_user) {
        const exists = await this.clientModel.findByPk(id_user);
        if (exists)
            return { message: 'Ya es client' };
        await this.clientModel.create({ id_user });
        return { message: 'Usuario convertido a client' };
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
        const client = await this.clientModel.findByPk(id_user);
        return {
            admin: !!admin,
            client: !!client,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(user_entity_1.User)),
    __param(1, (0, sequelize_1.InjectModel)(client_entity_1.Client)),
    __param(2, (0, sequelize_1.InjectModel)(profile_entity_1.Profile)),
    __param(3, (0, sequelize_1.InjectModel)(admin_entity_1.Admin)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, jobs_service_1.JobsService,
        utils_service_1.UtilsService])
], UsersService);
//# sourceMappingURL=users.service.js.map