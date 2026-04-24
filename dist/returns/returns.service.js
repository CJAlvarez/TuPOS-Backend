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
const sequelize_typescript_1 = require("sequelize-typescript");
const return_entity_1 = require("../entities/return.entity");
const utils_service_1 = require("../utils/utils.service");
const sale_item_entity_1 = require("../entities/sale-item.entity");
const product_entity_1 = require("../entities/product.entity");
const return_item_entity_1 = require("../entities/return-item.entity");
const inventory_entity_1 = require("../entities/inventory.entity");
let ReturnsService = class ReturnsService {
    returnModel;
    saleItemModel;
    returnItemModel;
    inventoryModel;
    utilsService;
    sequelize;
    constructor(returnModel, saleItemModel, returnItemModel, inventoryModel, utilsService, sequelize) {
        this.returnModel = returnModel;
        this.saleItemModel = saleItemModel;
        this.returnItemModel = returnItemModel;
        this.inventoryModel = inventoryModel;
        this.utilsService = utilsService;
        this.sequelize = sequelize;
    }
    async create(dto, internal_user_id, internal_store_id) {
        this.validateReturnItems(dto);
        const transaction = await this.sequelize.transaction();
        try {
            const returns = await this.createReturnEntity(dto, internal_user_id, internal_store_id, transaction);
            const payload = this.buildReturnItemsPayload(dto, returns.getDataValue('id'));
            await this.returnItemModel.bulkCreate(payload, { transaction });
            await this.restoreInventoryForReturnItems(payload, dto.id_sale, internal_store_id, internal_user_id, transaction);
            await transaction.commit();
            return returns;
        }
        catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    async findAll(query, id_store) {
        const { search_word, limit = 10, skip = 0, id_sale } = query;
        const where = {};
        if (id_store)
            where.id_store = id_store;
        where.deleted_at = { [sequelize_2.Op.is]: null };
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
                    attributes: ['id', 'id_product', 'id_sale_item'],
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
        if (id_sale && insert) {
            const returnedSaleItems = await this.returnItemModel.findAll({
                attributes: ['id_sale_item'],
                where: {
                    deleted_at: { [sequelize_2.Op.is]: null },
                },
                include: [
                    {
                        model: return_entity_1.Return,
                        required: true,
                        attributes: [],
                        where: {
                            id_sale,
                            deleted_at: { [sequelize_2.Op.is]: null },
                        },
                    },
                ],
                raw: true,
            });
            const returnedSaleItemIds = returnedSaleItems
                .map((item) => item.id_sale_item)
                .filter((id) => !!id);
            if (returnedSaleItemIds.length) {
                where.id = { [sequelize_2.Op.notIn]: returnedSaleItemIds };
            }
        }
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
        await this.returnModel.update({
            deleted_at: new Date(),
            deleted_by: internal_user_id,
        }, {
            where: {
                id,
                deleted_at: { [sequelize_2.Op.is]: null },
            },
        });
        return { title: 'Operación exitosa' };
    }
    async updateStatus(internal_user_id, dto) {
        return this.returnModel.update({
            disabled_at: dto.enable ? null : new Date(),
            disabled_by: dto.enable ? null : internal_user_id,
        }, { where: { id: dto.id }, returning: true });
    }
    validateReturnItems(dto) {
        if (!Array.isArray(dto.return_items) || dto.return_items.length === 0) {
            throw new common_1.BadRequestException('Debe seleccionar al menos un producto para la devolucion');
        }
    }
    async createReturnEntity(dto, internal_user_id, internal_store_id, transaction) {
        const date = new Date(dto.date);
        return this.returnModel.create({
            ...dto,
            date,
            created_by: internal_user_id,
            id_store: internal_store_id,
        }, { transaction });
    }
    buildReturnItemsPayload(dto, idReturn) {
        return dto.return_items.map((item) => {
            const matched = dto._return_items?.find((i) => i?.id_product === item || i?.id === item);
            const id_sale_item = matched?.id ?? item;
            const id_product = matched?.id_product ?? item;
            if (!id_sale_item || !id_product) {
                throw new common_1.BadRequestException(`No se pudo resolver el item de venta para el producto/item ${item}`);
            }
            return {
                id_return: idReturn,
                id_product,
                id_sale_item,
            };
        });
    }
    async getSaleItemsMapForReturnItems(payload, idSale, transaction) {
        const saleItemIds = payload.map((item) => item.id_sale_item);
        const saleItems = await this.saleItemModel.findAll({
            where: {
                id: { [sequelize_2.Op.in]: saleItemIds },
                id_sale: idSale,
            },
            transaction,
        });
        const saleItemsMap = new Map();
        saleItems.forEach((item) => saleItemsMap.set(item.getDataValue('id'), item));
        return saleItemsMap;
    }
    async restoreInventoryForReturnItems(payload, idSale, internal_store_id, internal_user_id, transaction) {
        const saleItemsMap = await this.getSaleItemsMapForReturnItems(payload, idSale, transaction);
        for (const item of payload) {
            const saleItem = saleItemsMap.get(item.id_sale_item);
            if (!saleItem) {
                throw new common_1.BadRequestException(`El item de venta ${item.id_sale_item} no pertenece a la venta ${idSale}`);
            }
            const quantityToRestore = Number(saleItem.getDataValue('quantity') || 0);
            if (!quantityToRestore)
                continue;
            const idInventory = saleItem.getDataValue('id_inventory');
            if (idInventory) {
                await this.restoreToLinkedInventory(idInventory, internal_store_id, item.id_product, quantityToRestore, internal_user_id, transaction);
            }
            else {
                await this.restoreToEachInventory(internal_store_id, item.id_product, quantityToRestore, internal_user_id, transaction);
            }
        }
    }
    async restoreToLinkedInventory(idInventory, idStore, idProduct, quantityToRestore, createdBy, transaction) {
        const inventory = await this.inventoryModel.findOne({
            where: {
                id: idInventory,
                id_store: idStore,
                id_product: idProduct,
            },
            transaction,
        });
        if (inventory) {
            await inventory.update({
                unit_quantity: Number(inventory.getDataValue('unit_quantity') || 0) + quantityToRestore,
            }, { transaction });
            return;
        }
        await this.createInventoryRecord(idStore, idProduct, quantityToRestore, createdBy, transaction);
    }
    async restoreToEachInventory(idStore, idProduct, quantityToRestore, createdBy, transaction) {
        const inventories = await this.inventoryModel.findAll({
            where: {
                id_store: idStore,
                id_product: idProduct,
            },
            transaction,
        });
        if (!inventories.length) {
            await this.createInventoryRecord(idStore, idProduct, quantityToRestore, createdBy, transaction);
            return;
        }
        for (const inventory of inventories) {
            await inventory.update({
                unit_quantity: Number(inventory.getDataValue('unit_quantity') || 0) + quantityToRestore,
            }, { transaction });
        }
    }
    async createInventoryRecord(idStore, idProduct, quantityToRestore, createdBy, transaction) {
        await this.inventoryModel.create({
            id_store: idStore,
            id_product: idProduct,
            unit_quantity: quantityToRestore,
            created_by: createdBy,
        }, { transaction });
    }
};
exports.ReturnsService = ReturnsService;
exports.ReturnsService = ReturnsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(return_entity_1.Return)),
    __param(1, (0, sequelize_1.InjectModel)(sale_item_entity_1.SaleItem)),
    __param(2, (0, sequelize_1.InjectModel)(return_item_entity_1.ReturnItem)),
    __param(3, (0, sequelize_1.InjectModel)(inventory_entity_1.Inventory)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, utils_service_1.UtilsService,
        sequelize_typescript_1.Sequelize])
], ReturnsService);
//# sourceMappingURL=returns.service.js.map