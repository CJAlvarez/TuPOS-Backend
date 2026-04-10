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
exports.SaleService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sale_entity_1 = require("../entities/sale.entity");
const sequelize_2 = require("sequelize");
const utils_service_1 = require("../utils/utils.service");
const sequelize_typescript_1 = require("sequelize-typescript");
const royalty_service_1 = require("../royalty/royalty.service");
const gift_card_service_1 = require("../gift-card/gift-card.service");
const inventory_service_1 = require("../inventory/inventory.service");
const payment_service_1 = require("../payment/payment.service");
const sale_item_service_1 = require("../sale-item/sale-item.service");
let SaleService = class SaleService {
    saleModel;
    utilsService;
    royaltyService;
    giftCardService;
    inventoryService;
    paymentService;
    saleItemService;
    sequelize;
    constructor(saleModel, utilsService, royaltyService, giftCardService, inventoryService, paymentService, saleItemService, sequelize) {
        this.saleModel = saleModel;
        this.utilsService = utilsService;
        this.royaltyService = royaltyService;
        this.giftCardService = giftCardService;
        this.inventoryService = inventoryService;
        this.paymentService = paymentService;
        this.saleItemService = saleItemService;
        this.sequelize = sequelize;
    }
    async findAll(query, id_store) {
        const { search_word, limit = 10, skip = 0 } = query;
        const where = {};
        if (id_store) {
            where.id_store = id_store;
        }
        where.deleted_at = { [sequelize_2.Op.is]: null };
        if (search_word) {
            where[sequelize_2.Op.or] = [
                { $id$: { [sequelize_2.Op.like]: `%${search_word}%` } },
                { $total$: { [sequelize_2.Op.like]: `%${search_word}%` } },
            ];
        }
        const total = await this.saleModel.count({ where });
        const paginate = this.utilsService.paginate(limit, skip, total, false);
        const rows = await this.saleModel.findAll({
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
        return this.saleModel.findOne({ where: { id } });
    }
    async create(internal_user_id, internal_store_id, dto) {
        const transaction = await this.sequelize.transaction();
        try {
            dto.id_store = internal_store_id;
            const saleNumber = await this.generateNumber();
            const sale = await this.createSale(dto, saleNumber, internal_user_id, transaction);
            await this.processItems(sale, dto.items, dto.id_store, transaction);
            await this.giftCardService.processGiftCards(dto.gift_cards, sale, internal_user_id, dto.id_store, transaction);
            const royaltyResult = await this.royaltyService.processRoyalty(dto, transaction);
            await this.royaltyService.generatePoints(dto.id_client, royaltyResult.moneyAmount, sale.id, internal_user_id, dto.id_store, transaction);
            await this.paymentService.createPayment(dto, sale, dto.id_store, internal_user_id, royaltyResult, transaction);
            await transaction.commit();
            return sale;
        }
        catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    async update(dto) {
        return this.saleModel.update(dto, {
            where: { id: dto.id },
            returning: true,
        });
    }
    async remove(internal_user_id, id) {
        await this.saleModel.update({
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
        return this.saleModel.update({
            disabled_at: dto.enable ? null : new Date(),
            disabled_by: dto.enable ? null : internal_user_id,
        }, { where: { id: dto.id }, returning: true });
    }
    async createSale(dto, saleNumber, userId, transaction) {
        return this.saleModel.create({
            id_client: dto.id_client || null,
            id_payment_method: dto.id_payment_method || 1,
            id_status: dto.id_status || 1,
            id_store: dto.id_store,
            number: saleNumber,
            subtotal: dto.subtotal,
            discount_total: dto.discount_total,
            tax_total: dto.tax_total,
            total: dto.total,
            date: dto.date || new Date(),
            notes: dto.notes || null,
            created_by: userId,
        }, { transaction });
    }
    async processItems(sale, items, storeId, transaction) {
        if (!items?.length)
            return;
        for (const item of items) {
            await this.saleItemService.createCustom(sale.id, item, storeId, transaction);
            await this.inventoryService.handleStock(item, transaction);
        }
    }
    async generateNumber() {
        const lastSale = await this.saleModel.findOne({
            order: [['id', 'DESC']],
        });
        if (!lastSale || !lastSale.getDataValue('number')) {
            return 'V-00001';
        }
        const lastNumber = lastSale.getDataValue('number').split('-')[1];
        const nextNumber = parseInt(lastNumber, 10) + 1;
        return `V-${nextNumber.toString().padStart(5, '0')}`;
    }
};
exports.SaleService = SaleService;
exports.SaleService = SaleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(sale_entity_1.Sale)),
    __metadata("design:paramtypes", [Object, utils_service_1.UtilsService,
        royalty_service_1.RoyaltyService,
        gift_card_service_1.GiftCardService,
        inventory_service_1.InventoryService,
        payment_service_1.PaymentService,
        sale_item_service_1.SaleItemService,
        sequelize_typescript_1.Sequelize])
], SaleService);
//# sourceMappingURL=sale.service.js.map