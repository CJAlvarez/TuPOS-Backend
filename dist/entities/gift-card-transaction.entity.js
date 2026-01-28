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
exports.GiftCardTransaction = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let GiftCardTransaction = class GiftCardTransaction extends sequelize_typescript_1.Model {
    id_store;
    id_gift_card;
    id_sale;
    id_type;
    amount;
    created_by;
    created_at;
    disabled_at;
    disabled_by;
    deleted_at;
    deleted_by;
};
exports.GiftCardTransaction = GiftCardTransaction;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], GiftCardTransaction.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true }),
    __metadata("design:type", Number)
], GiftCardTransaction.prototype, "id_store", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], GiftCardTransaction.prototype, "id_gift_card", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true }),
    __metadata("design:type", Number)
], GiftCardTransaction.prototype, "id_sale", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true }),
    __metadata("design:type", Number)
], GiftCardTransaction.prototype, "id_type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2), allowNull: false }),
    __metadata("design:type", Number)
], GiftCardTransaction.prototype, "amount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], GiftCardTransaction.prototype, "created_by", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'created_at', type: sequelize_typescript_1.DataType.DATE, defaultValue: sequelize_typescript_1.DataType.NOW }),
    __metadata("design:type", Date)
], GiftCardTransaction.prototype, "created_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true }),
    __metadata("design:type", Object)
], GiftCardTransaction.prototype, "disabled_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true }),
    __metadata("design:type", Object)
], GiftCardTransaction.prototype, "disabled_by", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true }),
    __metadata("design:type", Object)
], GiftCardTransaction.prototype, "deleted_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true }),
    __metadata("design:type", Object)
], GiftCardTransaction.prototype, "deleted_by", void 0);
exports.GiftCardTransaction = GiftCardTransaction = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'gift_card_transactions',
        timestamps: false,
    })
], GiftCardTransaction);
//# sourceMappingURL=gift-card-transaction.entity.js.map