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
exports.RoyaltyService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const royalty_entity_1 = require("../entities/royalty.entity");
const sequelize_2 = require("sequelize");
const utils_service_1 = require("../utils/utils.service");
let RoyaltyService = class RoyaltyService {
    royaltyModel;
    utilsService;
    constructor(royaltyModel, utilsService) {
        this.royaltyModel = royaltyModel;
        this.utilsService = utilsService;
    }
    async findAll(query, id_store) {
        const { search_word, limit = 10, skip = 0, id_client } = query;
        const where = {};
        if (id_store)
            where.id_store = id_store;
        if (id_client)
            where.id_client = id_client;
        if (search_word) {
            where[sequelize_2.Op.or] = [
                { $id$: { [sequelize_2.Op.like]: `%${search_word}%` } },
                { $points$: { [sequelize_2.Op.like]: `%${search_word}%` } },
            ];
        }
        const total = await this.royaltyModel.count({ where });
        const paginate = this.utilsService.paginate(limit, skip, total, false);
        const rows = await this.royaltyModel.findAll({
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
    async findOne(id) {
        return this.royaltyModel.findOne({ where: { id } });
    }
    async create(internal_user_id, internal_store_id, dto) {
        dto.created_by = internal_user_id;
        dto.id_store = internal_store_id;
        return this.royaltyModel.create(dto);
    }
    async update(dto) {
        return this.royaltyModel.update(dto, {
            where: { id: dto.id },
            returning: true,
        });
    }
    async remove(internal_user_id, id) {
        const [affectedRows] = await this.royaltyModel.update({
            deleted_at: new Date(),
            deleted_by: internal_user_id,
        }, {
            where: {
                id,
                deleted_at: { [sequelize_2.Op.is]: null },
            },
        });
        return affectedRows;
    }
    async updateStatus(internal_user_id, dto) {
        return this.royaltyModel.update({
            disabled_at: dto.enable ? null : new Date(),
            disabled_by: dto.enable ? null : internal_user_id,
        }, { where: { id: dto.id }, returning: true });
    }
};
exports.RoyaltyService = RoyaltyService;
exports.RoyaltyService = RoyaltyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(royalty_entity_1.Royalty)),
    __metadata("design:paramtypes", [Object, utils_service_1.UtilsService])
], RoyaltyService);
//# sourceMappingURL=royalty.service.js.map