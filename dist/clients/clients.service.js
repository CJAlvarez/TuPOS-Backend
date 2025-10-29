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
exports.ClientsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const client_entity_1 = require("../entities/client.entity");
const user_entity_1 = require("../entities/user.entity");
const profile_entity_1 = require("../entities/profile.entity");
const sequelize_2 = require("sequelize");
const utils_service_1 = require("../utils/utils.service");
const jobs_service_1 = require("../jobs/jobs.service");
const sequelize_typescript_1 = require("sequelize-typescript");
let ClientsService = class ClientsService {
    clientModel;
    userModel;
    profileModel;
    jobsService;
    utilsService;
    sequelize;
    constructor(clientModel, userModel, profileModel, jobsService, utilsService, sequelize) {
        this.clientModel = clientModel;
        this.userModel = userModel;
        this.profileModel = profileModel;
        this.jobsService = jobsService;
        this.utilsService = utilsService;
        this.sequelize = sequelize;
    }
    async getClients(query, id_store) {
        const { search_word, limit = 10, skip = 0 } = query;
        const where = {};
        if (id_store)
            where.id_store = id_store;
        if (search_word) {
            where[sequelize_2.Op.or] = [
                { '$profile.identification$': { [sequelize_2.Op.like]: `%${search_word}%` } },
                { '$profile.phone$': { [sequelize_2.Op.like]: `%${search_word}%` } },
                { '$user.email$': { [sequelize_2.Op.like]: `%${search_word}%` } },
                this.sequelize.literal(`MATCH(profile.firstname, profile.lastname) AGAINST('${search_word.trim().replace(/'/g, "''")}' IN BOOLEAN MODE)`),
            ];
        }
        const total = await this.clientModel.count({
            include: [
                { model: user_entity_1.User, as: 'user', required: true },
                { model: profile_entity_1.Profile, as: 'profile', required: true },
            ],
            where,
        });
        const paginate = this.utilsService.paginate(limit, skip, total, false);
        const rows = await this.clientModel.findAll({
            include: [
                { model: user_entity_1.User, as: 'user', required: true },
                { model: profile_entity_1.Profile, as: 'profile', required: true },
            ],
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
    async getClientDetail(id) {
        const client = await this.clientModel.findOne({
            where: { id_user: id },
            include: [
                { model: this.userModel, as: 'user', required: true },
                { model: this.profileModel, as: 'profile', required: true },
            ],
        });
        if (!client) {
            throw new Error('Cliente no encontrado');
        }
        return client;
    }
    async insertClient(createClientDto, id_store, id_user) {
        const { user, profile } = createClientDto;
        if (!user || !profile)
            throw new Error('Datos incompletos');
        if (!profile.firstname ||
            !profile.lastname ||
            !profile.id_country ||
            !profile.identification ||
            !profile.id_gender) {
            throw new Error('Faltan campos obligatorios');
        }
        const existingProfile = await this.profileModel.findOne({
            where: {
                identification: profile.identification.replace(/-/g, ''),
                id_country: profile.id_country,
            },
            include: [
                {
                    model: this.clientModel,
                    as: 'client',
                    where: { id_store },
                    required: true,
                },
            ],
        });
        if (existingProfile)
            throw new Error('Ya existe un usuario con esa identificación y país en esta tienda');
        if (user.email) {
            const existingUser = await this.userModel.findOne({
                where: { email: user.email },
                include: [
                    {
                        model: this.clientModel,
                        as: 'client',
                        where: { id_store },
                        required: true,
                    },
                ],
            });
            if (existingUser)
                throw new Error('Ya existe un usuario con ese email en esta tienda');
        }
        const newUser = await this.userModel.create({
            ...user,
            firstLogin: true,
            steps2: false,
            created_by: id_user,
        });
        await this.clientModel.create({
            id_user: newUser.id,
            id_store,
        });
        await this.profileModel.create({ ...profile, id_user: newUser.id });
        return {
            title: 'Operación Exitosa',
            message: 'El cliente ha sido creado.',
            id_user: newUser.id,
        };
    }
    async updateClient(updateClientDto) {
        const client = await this.clientModel.findOne({
            where: { id_user: updateClientDto.user.id },
        });
        if (!client)
            throw new Error('Cliente no encontrado');
        if (updateClientDto.user) {
            await this.userModel.update(updateClientDto.user, {
                where: { id: updateClientDto.user.id },
            });
        }
        if (updateClientDto.profile) {
            await this.profileModel.update(updateClientDto.profile, {
                where: { id_user: updateClientDto.user.id },
            });
        }
        return {
            title: 'Operación Exitosa',
            message: 'El cliente ha sido actualizado.',
        };
    }
    async updateClientStatus(internal_user_id, body) {
        if (!body ||
            typeof body.id !== 'number' ||
            typeof body.enable !== 'boolean') {
            throw {
                title: 'Operación No Permitida',
                message: 'Datos incompletos.',
                status: 400,
            };
        }
        await this.clientModel.update({
            disabled_at: body.enable ? null : new Date(),
            disabled_by: body.enable ? null : internal_user_id,
        }, { where: { id_user: body.id } });
        const user = await this.userModel.findOne({ where: { id: body.id } });
        const profile = await this.profileModel.findOne({
            where: { id_user: body.id },
        });
        if (user && profile) {
            await this.jobsService.addJob({
                type: 'sendEmailTemplate',
                data: {
                    to: user.email,
                    subject: body.enable ? 'Usuario Habilitado' : 'Usuario Deshabilitado',
                    replacements: {
                        logo_dark: 'https://tuposhn.com/assets/images/logo-dark2-sm.png',
                        logo_light: 'https://tuposhn.com/assets/images/logotipo-blanco.png',
                        content: [
                            {
                                type: 'normal',
                                text: `Hola, ${profile.firstname} ${profile.lastname}`,
                            },
                            { type: 'skip' },
                            {
                                type: 'normal',
                                text: `Tu acceso a la plataforma de Clientes ha sido ${body.enable ? 'Habilitado' : 'Deshabilitado'} por un Administrador.`,
                            },
                            { type: 'skip' },
                            {
                                type: 'small',
                                text: 'Para mayor información contáctate con nosotros.',
                            },
                        ],
                    },
                },
            });
        }
        return {
            title: 'Operación Exitosa',
            message: `El cliente ha sido ${body.enable ? 'Habilitado' : 'Deshabilitado'}.`,
        };
    }
    async findByUserId(id_user) {
        return this.getClientDetail(id_user);
    }
};
exports.ClientsService = ClientsService;
exports.ClientsService = ClientsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(client_entity_1.Client)),
    __param(1, (0, sequelize_1.InjectModel)(user_entity_1.User)),
    __param(2, (0, sequelize_1.InjectModel)(profile_entity_1.Profile)),
    __metadata("design:paramtypes", [Object, Object, Object, jobs_service_1.JobsService,
        utils_service_1.UtilsService,
        sequelize_typescript_1.Sequelize])
], ClientsService);
//# sourceMappingURL=clients.service.js.map