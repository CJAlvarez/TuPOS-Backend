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
exports.StoreService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const store_entity_1 = require("../entities/store.entity");
const sequelize_2 = require("sequelize");
const utils_service_1 = require("../utils/utils.service");
let StoreService = class StoreService {
    storeModel;
    utilsService;
    constructor(storeModel, utilsService) {
        this.storeModel = storeModel;
        this.utilsService = utilsService;
    }
    async findAll(query) {
        const { search_word, limit = 10, skip = 0 } = query;
        const where = {};
        if (search_word) {
            where[sequelize_2.Op.or] = [
                { $name$: { [sequelize_2.Op.like]: `%${search_word}%` } },
                { $code$: { [sequelize_2.Op.like]: `%${search_word}%` } },
                { $address$: { [sequelize_2.Op.like]: `%${search_word}%` } },
                { $phone$: { [sequelize_2.Op.like]: `%${search_word}%` } },
                { $email$: { [sequelize_2.Op.like]: `%${search_word}%` } },
            ];
        }
        const total = await this.storeModel.count({ where });
        const paginate = this.utilsService.paginate(limit, skip, total, false);
        const rows = await this.storeModel.findAll({
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
        return this.storeModel.findOne({ where: { id } });
    }
    async create(internal_user_id, dto) {
        dto.created_by = internal_user_id;
        return this.storeModel.create(dto);
    }
    async update(dto) {
        return this.storeModel.update(dto, { where: { id: dto.id }, returning: true });
    }
    async remove(internal_user_id, id) {
        const [affectedRows] = await this.storeModel.update({
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
        return this.storeModel.update({
            disabled_at: dto.enable ? null : new Date(),
            disabled_by: dto.enable ? null : internal_user_id,
        }, { where: { id: dto.id }, returning: true });
    }
};
exports.StoreService = StoreService;
exports.StoreService = StoreService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(store_entity_1.Store)),
    __metadata("design:paramtypes", [Object, utils_service_1.UtilsService])
], StoreService);
//# sourceMappingURL=store.service.js.map