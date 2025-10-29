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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const product_entity_1 = require("../entities/product.entity");
const sequelize_2 = require("sequelize");
const utils_service_1 = require("../utils/utils.service");
const inventory_entity_1 = require("../entities/inventory.entity");
let ProductsService = class ProductsService {
    productModel;
    utilsService;
    constructor(productModel, utilsService) {
        this.productModel = productModel;
        this.utilsService = utilsService;
    }
    async findAll(query, id_store) {
        const { search_word, limit = 10, skip = 0 } = query;
        const where = {};
        if (id_store)
            where.id_store = id_store;
        if (search_word) {
            where[sequelize_2.Op.or] = [
                { $name$: { [sequelize_2.Op.like]: `%${search_word}%` } },
                { $code$: { [sequelize_2.Op.like]: `%${search_word}%` } },
                { $category$: { [sequelize_2.Op.like]: `%${search_word}%` } },
            ];
        }
        const total = await this.productModel.count({
            where,
        });
        const paginate = this.utilsService.paginate(limit, skip, total, false);
        const rows = await this.productModel.findAll({
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
    async getProductsPOS(query, id_store) {
        const { search_word } = query;
        const where = {
            disabled_at: { [sequelize_2.Op.is]: null },
        };
        if (id_store)
            where.id_store = id_store;
        if (search_word) {
            where[sequelize_2.Op.or] = [
                { $name$: { [sequelize_2.Op.like]: `%${search_word}%` } },
                { $code$: { [sequelize_2.Op.like]: `%${search_word}%` } },
                { $category$: { [sequelize_2.Op.like]: `%${search_word}%` } },
            ];
        }
        const rows = await this.productModel.findAll({
            where,
            include: [
                {
                    model: inventory_entity_1.Inventory,
                    as: 'inventorys',
                    order: [['expiration_date', 'DESC']],
                    attributes: ['id', 'id_product', 'unit_quantity'],
                },
            ],
        });
        return {
            count: rows.length,
            list: rows.map((row) => row.toJSON()),
            skip: 0,
        };
    }
    async findOne(id) {
        return this.productModel.findOne({
            where: {
                id,
                deleted_at: { [sequelize_2.Op.is]: null },
            },
        });
    }
    async create(internal_user_id, internal_store_id, dto) {
        dto.created_by = internal_user_id;
        dto.id_store = internal_store_id;
        return this.productModel.create(dto);
    }
    async update(dto) {
        return this.productModel.update(dto, {
            where: { id: dto.id },
            returning: true,
        });
    }
    async remove(internal_user_id, id) {
        const [affectedRows] = await this.productModel.update({
            deleted_at: new Date(),
            deleted_by: internal_user_id,
        }, {
            where: {
                id,
                deleted_at: { [sequelize_2.Op.not]: null },
            },
        });
        return affectedRows;
    }
    async updateStatus(internal_user_id, dto) {
        return this.productModel.update({
            disabled_at: dto.enable ? null : new Date(),
            disabled_by: dto.enable ? null : internal_user_id,
        }, { where: { id: dto.id }, returning: true });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(product_entity_1.Product)),
    __metadata("design:paramtypes", [Object, utils_service_1.UtilsService])
], ProductsService);
//# sourceMappingURL=products.service.js.map