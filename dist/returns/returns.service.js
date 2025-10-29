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
exports.ReturnsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const return_entity_1 = require("../entities/return.entity");
const utils_service_1 = require("../utils/utils.service");
const sale_item_entity_1 = require("../entities/sale-item.entity");
const product_entity_1 = require("../entities/product.entity");
const return_item_entity_1 = require("../entities/return-item.entity");
let ReturnsService = class ReturnsService {
    returnModel;
    saleItemModel;
    returnItemModel;
    utilsService;
    constructor(returnModel, saleItemModel, returnItemModel, utilsService) {
        this.returnModel = returnModel;
        this.saleItemModel = saleItemModel;
        this.returnItemModel = returnItemModel;
        this.utilsService = utilsService;
    }
    async create(dto, internal_user_id, internal_store_id) {
        const date = new Date(dto.date);
        const returns = await this.returnModel.create({
            ...dto,
            date,
            created_by: internal_user_id,
            id_store: internal_store_id,
        });
        this.returnItemModel.bulkCreate(dto.return_items.map((item) => ({
            id_return: returns.getDataValue('id'),
            id_product: item,
            id_sale_item: dto._return_items.find((i) => i.id_product === item)?.id || null,
        })));
        return returns;
    }
    async findAll(query, id_store) {
        const { search_word, limit = 10, skip = 0, id_sale } = query;
        const where = {};
        if (id_store)
            where.id_store = id_store;
        if (id_sale)
            where.id_sale = id_sale;
        if (search_word) {
            where[sequelize_2.Op.or] = [
                { reason: { [sequelize_2.Op.like]: `%${search_word}%` } },
                { status: { [sequelize_2.Op.like]: `%${search_word}%` } },
            ];
        }
        where.deleted_at = { [sequelize_2.Op.is]: null };
        const total = await this.returnModel.count({ where });
        const paginate = this.utilsService.paginate(limit, skip, total, false);
        const rows = await this.returnModel.findAll({
            where,
            limit: paginate.limit,
            offset: paginate.offset,
            order: [['id', 'DESC']],
            include: [
                {
                    model: return_item_entity_1.ReturnItem,
                    required: false,
                    as: 'return_items',
                    attributes: ['id', 'id_product'],
                },
            ],
        });
        return {
            count: total,
            list: rows.map((row) => row.toJSON()),
            skip: paginate.skip,
        };
    }
    async getProducts(query) {
        const { id_sale, insert } = query;
        const where = {};
        if (id_sale)
            where.id_sale = id_sale;
        if (!insert)
            where.deleted_at = { [sequelize_2.Op.is]: null };
        const rows = await this.saleItemModel.findAll({
            where,
            order: [['id', 'ASC']],
            include: [
                {
                    model: product_entity_1.Product,
                    required: true,
                    as: 'product',
                    attributes: ['id', 'name', 'code'],
                },
            ],
            raw: true,
        });
        return rows;
    }
    async findOne(id) {
        const item = await this.returnModel.findOne({
            where: {
                id,
                deleted_at: { [sequelize_2.Op.is]: null },
            },
        });
        if (!item)
            throw new common_1.NotFoundException('Return not found');
        return item;
    }
    async update(dto, internal_user_id) {
        const date = new Date(dto.date);
        const [affectedRows, [updated]] = await this.returnModel.update({ ...dto, date }, {
            where: {
                id: dto.id,
                deleted_at: { [sequelize_2.Op.is]: null },
            },
            returning: true,
        });
        if (!affectedRows)
            throw new common_1.NotFoundException('Return not found');
        return updated;
    }
    async remove(internal_user_id, id) {
        const [affectedRows] = await this.returnModel.update({
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
        return this.returnModel.update({
            disabled_at: dto.enable ? null : new Date(),
            disabled_by: dto.enable ? null : internal_user_id,
        }, { where: { id: dto.id }, returning: true });
    }
};
exports.ReturnsService = ReturnsService;
exports.ReturnsService = ReturnsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(return_entity_1.Return)),
    __param(1, (0, sequelize_1.InjectModel)(sale_item_entity_1.SaleItem)),
    __param(2, (0, sequelize_1.InjectModel)(return_item_entity_1.ReturnItem)),
    __metadata("design:paramtypes", [Object, Object, Object, utils_service_1.UtilsService])
], ReturnsService);
//# sourceMappingURL=returns.service.js.map