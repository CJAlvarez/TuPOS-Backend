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
exports.DiscountRuleService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const discount_rule_entity_1 = require("../entities/discount-rule.entity");
const sequelize_2 = require("sequelize");
const utils_service_1 = require("../utils/utils.service");
let DiscountRuleService = class DiscountRuleService {
    discountRuleModel;
    utilsService;
    constructor(discountRuleModel, utilsService) {
        this.discountRuleModel = discountRuleModel;
        this.utilsService = utilsService;
    }
    async findAll(query, id_store) {
        const { search_word, limit = 10, skip = 0 } = query;
        const where = {};
        if (id_store)
            where.id_store = id_store;
        if (search_word) {
            where[sequelize_2.Op.or] = [
                { $id$: { [sequelize_2.Op.like]: `%${search_word}%` } },
                { $name$: { [sequelize_2.Op.like]: `%${search_word}%` } },
            ];
        }
        const total = await this.discountRuleModel.count({ where });
        const paginate = this.utilsService.paginate(limit, skip, total, false);
        const rows = await this.discountRuleModel.findAll({
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
        return this.discountRuleModel.findOne({ where: { id } });
    }
    async create(internal_user_id, internal_store_id, dto) {
        dto.created_by = internal_user_id;
        dto.id_store = internal_store_id;
        return this.discountRuleModel.create(dto);
    }
    async update(dto) {
        return this.discountRuleModel.update(dto, { where: { id: dto.id }, returning: true });
    }
    async remove(internal_user_id, id) {
        const [affectedRows] = await this.discountRuleModel.update({
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
        return this.discountRuleModel.update({
            disabled_at: dto.enable ? null : new Date(),
            disabled_by: dto.enable ? null : internal_user_id,
        }, { where: { id: dto.id }, returning: true });
    }
};
exports.DiscountRuleService = DiscountRuleService;
exports.DiscountRuleService = DiscountRuleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(discount_rule_entity_1.DiscountRule)),
    __metadata("design:paramtypes", [Object, utils_service_1.UtilsService])
], DiscountRuleService);
//# sourceMappingURL=discount-rule.service.js.map