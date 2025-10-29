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
const sale_item_entity_1 = require("../entities/sale-item.entity");
const product_entity_1 = require("../entities/product.entity");
const inventory_entity_1 = require("../entities/inventory.entity");
const payment_entity_1 = require("../entities/payment.entity");
const gift_card_entity_1 = require("../entities/gift-card.entity");
const gift_card_transaction_entity_1 = require("../entities/gift-card-transaction.entity");
const sequelize_2 = require("sequelize");
const utils_service_1 = require("../utils/utils.service");
const sequelize_typescript_1 = require("sequelize-typescript");
let SaleService = class SaleService {
    saleModel;
    saleItemModel;
    productModel;
    inventoryModel;
    paymentModel;
    giftCardModel;
    giftCardTransactionModel;
    utilsService;
    sequelize;
    constructor(saleModel, saleItemModel, productModel, inventoryModel, paymentModel, giftCardModel, giftCardTransactionModel, utilsService, sequelize) {
        this.saleModel = saleModel;
        this.saleItemModel = saleItemModel;
        this.productModel = productModel;
        this.inventoryModel = inventoryModel;
        this.paymentModel = paymentModel;
        this.giftCardModel = giftCardModel;
        this.giftCardTransactionModel = giftCardTransactionModel;
        this.utilsService = utilsService;
        this.sequelize = sequelize;
    }
    async findAll(query, id_store) {
        const { search_word, limit = 10, skip = 0 } = query;
        const where = {};
        if (id_store) {
            where.id_store = id_store;
        }
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
            const saleNumber = await this.generateSaleNumber();
            const sale = await this.saleModel.create({
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
                created_by: internal_user_id,
            }, { transaction });
            if (dto.items && dto.items.length > 0) {
                for (const item of dto.items) {
                    await this.saleItemModel.create({
                        id_sale: sale.getDataValue('id'),
                        id_product: item.id_product,
                        quantity: item.quantity,
                        price: item.price,
                        discount: item.discount,
                        tax: item.tax,
                        total: item.total,
                    }, { transaction });
                    const product = await this.productModel.findByPk(item.id_product, {
                        transaction,
                    });
                    if (!product) {
                        throw new common_1.BadRequestException(`Producto con ID ${item.id_product} no encontrado`);
                    }
                    let unitsToDeduct = item.quantity;
                    const boxAmount = product.getDataValue('box_amount');
                    if (item.sale_type === 'box' && boxAmount) {
                        unitsToDeduct = item.quantity * boxAmount;
                    }
                    console.log(`Producto: ${product.getDataValue('name')}, Tipo: ${item.sale_type}, Cantidad en venta: ${item.quantity}, Unidades a descontar: ${unitsToDeduct}`);
                    const inventories = await this.inventoryModel.findAll({
                        where: {
                            id_product: item.id_product,
                            unit_quantity: {
                                [sequelize_2.Op.gt]: 0,
                            },
                        },
                        order: [
                            [this.sequelize.literal('ISNULL(expiration_date)'), 'ASC'],
                            ['expiration_date', 'ASC'],
                        ],
                        transaction,
                    });
                    let availableStock = inventories.reduce((sum, inv) => sum + inv.getDataValue('unit_quantity'), 0);
                    if (unitsToDeduct > availableStock) {
                        throw new common_1.BadRequestException(`Stock insuficiente para el producto ${product.getDataValue('name')}. Disponible: ${availableStock}, Requerido: ${unitsToDeduct}`);
                    }
                    let remainingToDeduct = unitsToDeduct;
                    for (const inventory of inventories) {
                        if (remainingToDeduct <= 0)
                            break;
                        const currentQuantity = inventory.getDataValue('unit_quantity');
                        const quantityToTake = Math.min(currentQuantity, remainingToDeduct);
                        console.log(`Inventario ID: ${inventory.getDataValue('id')}, Stock actual: ${currentQuantity}, Descontando: ${quantityToTake}, Quedará: ${currentQuantity - quantityToTake}`);
                        await inventory.update({
                            unit_quantity: currentQuantity - quantityToTake,
                        }, { transaction });
                        remainingToDeduct -= quantityToTake;
                    }
                }
            }
            if (dto.gift_cards && dto.gift_cards.length > 0) {
                for (const giftCardData of dto.gift_cards) {
                    const giftCard = await this.giftCardModel.findByPk(giftCardData.id_gift_card, { transaction });
                    if (!giftCard) {
                        throw new common_1.BadRequestException(`Tarjeta de regalo con ID ${giftCardData.id_gift_card} no encontrada`);
                    }
                    const currentBalanceRaw = giftCard.getDataValue('current_balance');
                    const currentBalance = typeof currentBalanceRaw === 'string'
                        ? parseFloat(currentBalanceRaw)
                        : currentBalanceRaw;
                    if (currentBalance < giftCardData.amount_used) {
                        throw new common_1.BadRequestException(`Saldo insuficiente en la tarjeta de regalo ${giftCard.getDataValue('code')}`);
                    }
                    const newBalance = currentBalance - giftCardData.amount_used;
                    await giftCard.update({
                        current_balance: newBalance,
                    }, { transaction });
                    await this.giftCardTransactionModel.create({
                        id_gift_card: giftCard.getDataValue('id'),
                        id_sale: sale.getDataValue('id'),
                        amount: -giftCardData.amount_used,
                        balance_after: newBalance,
                        transaction_type: 'use',
                        notes: `Aplicada a venta #${saleNumber}`,
                        created_by: internal_user_id,
                    }, { transaction });
                }
            }
            await this.paymentModel.create({
                id_sale: sale.getDataValue('id'),
                id_payment_method: dto.payment.id_payment_method,
                amount: dto.payment.amount,
                reference: dto.payment.reference || null,
                date: dto.date || new Date(),
                created_by: internal_user_id,
            }, { transaction });
            await transaction.commit();
            return sale;
        }
        catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    async generateSaleNumber() {
        const lastSale = await this.saleModel.findOne({
            order: [['id', 'DESC']],
        });
        if (!lastSale || !lastSale.number) {
            return 'V-00001';
        }
        const lastNumber = lastSale.number.split('-')[1];
        const nextNumber = parseInt(lastNumber, 10) + 1;
        return `V-${nextNumber.toString().padStart(5, '0')}`;
    }
    async update(dto) {
        return this.saleModel.update(dto, {
            where: { id: dto.id },
            returning: true,
        });
    }
    async remove(internal_user_id, id) {
        const [affectedRows] = await this.saleModel.update({
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
        return this.saleModel.update({
            disabled_at: dto.enable ? null : new Date(),
            disabled_by: dto.enable ? null : internal_user_id,
        }, { where: { id: dto.id }, returning: true });
    }
};
exports.SaleService = SaleService;
exports.SaleService = SaleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(sale_entity_1.Sale)),
    __param(1, (0, sequelize_1.InjectModel)(sale_item_entity_1.SaleItem)),
    __param(2, (0, sequelize_1.InjectModel)(product_entity_1.Product)),
    __param(3, (0, sequelize_1.InjectModel)(inventory_entity_1.Inventory)),
    __param(4, (0, sequelize_1.InjectModel)(payment_entity_1.Payment)),
    __param(5, (0, sequelize_1.InjectModel)(gift_card_entity_1.GiftCard)),
    __param(6, (0, sequelize_1.InjectModel)(gift_card_transaction_entity_1.GiftCardTransaction)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, utils_service_1.UtilsService,
        sequelize_typescript_1.Sequelize])
], SaleService);
//# sourceMappingURL=sale.service.js.map