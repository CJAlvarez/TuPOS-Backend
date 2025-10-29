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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_typescript_1 = require("sequelize-typescript");
const catalog_version_entity_1 = require("../entities/catalog-version.entity");
const profile_entity_1 = require("../entities/profile.entity");
const user_entity_1 = require("../entities/user.entity");
const client_entity_1 = require("../entities/client.entity");
const sequelize_1 = require("sequelize");
let CatalogsService = class CatalogsService {
    sequelize;
    constructor(sequelize) {
        this.sequelize = sequelize;
    }
    async getCatalogs(query) {
        const { catalogs } = query;
        const catalogList = Array.isArray(catalogs) ? catalogs : [catalogs];
        if (catalogList.length === 0) {
            throw new common_1.BadRequestException('Debe especificar al menos un catálogo');
        }
        const result = {};
        for (const catalog of catalogList) {
            if (!/^[a-zA-Z0-9_]+$/.test(catalog)) {
                throw new common_1.BadRequestException(`Nombre de catálogo inválido: ${catalog}`);
            }
            const [rows] = await this.sequelize.query(`SELECT * FROM \`${catalog}\`;`);
            result[catalog] = rows;
        }
        return result;
    }
    async getCatalogsVersion() {
        const rows = await catalog_version_entity_1.CatalogVersion.findAll();
        return rows;
    }
    async updateCatalogVersion(key, date = new Date()) {
        await catalog_version_entity_1.CatalogVersion.upsert({ key, catalog_version: date });
    }
    async getClients(search_word) {
        const clientWhere = search_word
            ? {
                [sequelize_1.Op.or]: [
                    {
                        '$profile.identification$': {
                            [sequelize_1.Op.like]: `%${search_word.trim().replace(/-/g, '')}%`,
                        },
                    },
                    this.sequelize.literal(`MATCH(profile.firstname, profile.lastname) AGAINST('${search_word.trim().replace(/'/g, "''")}' IN BOOLEAN MODE)`),
                ],
            }
            : undefined;
        const clients = await client_entity_1.Client.findAll({
            where: clientWhere,
            attributes: [],
            include: [
                {
                    model: user_entity_1.User,
                    as: 'user',
                    attributes: ['id'],
                },
                {
                    model: profile_entity_1.Profile,
                    as: 'profile',
                    attributes: ['firstname', 'lastname', 'identification'],
                },
            ],
            order: [
                [{ model: profile_entity_1.Profile, as: 'profile' }, 'firstname', 'ASC'],
                [{ model: profile_entity_1.Profile, as: 'profile' }, 'lastname', 'ASC'],
                [{ model: profile_entity_1.Profile, as: 'profile' }, 'identification', 'ASC'],
            ],
        });
        return clients.map((client) => {
            const name = `${client.getDataValue('profile')?.getDataValue('firstname') ?? ''} ${client.getDataValue('profile')?.getDataValue('lastname') ?? ''}`.trim();
            return {
                id_user: client.getDataValue('user')?.getDataValue('id'),
                name: name,
                text: `${name} - ${client.getDataValue('profile')?.getDataValue('identification') ?? ''}`.trim(),
            };
        });
    }
};
exports.CatalogsService = CatalogsService;
exports.CatalogsService = CatalogsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize])
], CatalogsService);
//# sourceMappingURL=catalogs.service.js.map