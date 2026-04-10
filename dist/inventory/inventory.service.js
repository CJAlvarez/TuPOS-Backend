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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const inventory_entity_1 = require("../entities/inventory.entity");
const sequelize_2 = require("sequelize");
const utils_service_1 = require("../utils/utils.service");
const sequelize_typescript_1 = require("sequelize-typescript");
const product_entity_1 = require("../entities/product.entity");
const mathTools = require("../utils/math-tools");
let InventoryService = class InventoryService {
    inventoryModel;
    productModel;
    utilsService;
    sequelize;
    constructor(inventoryModel, productModel, utilsService, sequelize) {
        this.inventoryModel = inventoryModel;
        this.productModel = productModel;
        this.utilsService = utilsService;
        this.sequelize = sequelize;
    }
    async findAll(query, id_store) {
        const { search_word, limit = 10, skip = 0 } = query;
        const where = {};
        if (id_store) {
            where.id_store = id_store;
        }
        if (query.id_product) {
            where.id_product = query.id_product;
        }
        const total = await this.inventoryModel.count({ where });
        const paginate = this.utilsService.paginate(limit, skip, total, false);
        const rows = await this.inventoryModel.findAll({
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
        return this.inventoryModel.findOne({ where: { id } });
    }
    async create(internal_user_id, internal_store_id, dto) {
        dto.created_by = internal_user_id;
        dto.id_store = internal_store_id;
        return this.inventoryModel.create(dto);
    }
    async update(dto) {
        return this.inventoryModel.update(dto, {
            where: { id: dto.id },
            returning: true,
        });
    }
    async remove(internal_user_id, id) {
        return this.inventoryModel.destroy({ where: { id } });
    }
    async handleStock(item, transaction) {
        const product = await this.productModel.findByPk(item.id_product, {
            transaction,
        });
        if (!product) {
            throw new common_1.BadRequestException(`Producto ${item.id_product} no encontrado`);
        }
        const unitsToDeduct = this.calculateUnits(item, product);
        const inventories = await this.getAvailableInventories(item.id_product, transaction);
        this.validateStock(inventories, unitsToDeduct, product.getDataValue('name'));
        await this.applyFifo(inventories, unitsToDeduct, transaction);
    }
    calculateUnits(item, product) {
        if (item.sale_type === 'box' && product.getDataValue('box_amount')) {
            return mathTools.mul(item.quantity, product.getDataValue('box_amount'));
        }
        return item.quantity;
    }
    async getAvailableInventories(productId, transaction) {
        return this.inventoryModel.findAll({
            where: {
                id_product: productId,
                unit_quantity: { [sequelize_2.Op.gt]: 0 },
                [sequelize_2.Op.or]: [
                    { expiration_date: { [sequelize_2.Op.gte]: new Date() } },
                    { expiration_date: { [sequelize_2.Op.eq]: null } },
                ],
            },
            order: [
                ['expiration_date', 'ASC'],
                ['created_at', 'ASC'],
            ],
            transaction,
        });
    }
    validateStock(inventories, required, productName) {
        const total = inventories.reduce((sum, i) => mathTools.add(sum, i.getDataValue('unit_quantity')), 0);
        if (required > total) {
            throw new common_1.BadRequestException(`Stock insuficiente para ${productName}. Disponible: ${total}`);
        }
    }
    async applyFifo(inventories, quantity, transaction) {
        let remaining = quantity;
        const updates = [];
        for (const inv of inventories) {
            if (remaining <= 0)
                break;
            const current = inv.getDataValue('unit_quantity');
            const take = Math.min(current, remaining);
            updates.push({
                id: inv.getDataValue('id'),
                newQty: current - take,
            });
            remaining -= take;
        }
        if (!updates.length)
            return;
        await this.bulkUpdateInventories(updates, transaction);
    }
    async bulkUpdateInventories(updates, transaction) {
        const ids = updates.map((u) => u.id);
        const cases = updates.map((u) => `WHEN ${u.id} THEN ${u.newQty}`).join(' ');
        const sql = `
    UPDATE inventorys
    SET unit_quantity = CASE id
      ${cases}
    END
    WHERE id IN (${ids.join(',')})
  `;
        await this.sequelize.query(sql, { transaction });
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(inventory_entity_1.Inventory)),
    __param(1, (0, sequelize_1.InjectModel)(product_entity_1.Product)),
    __metadata("design:paramtypes", [Object, Object, utils_service_1.UtilsService,
        sequelize_typescript_1.Sequelize])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map