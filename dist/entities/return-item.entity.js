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
exports.ReturnItem = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const return_entity_1 = require("./return.entity");
let ReturnItem = class ReturnItem extends sequelize_typescript_1.Model {
    id_store;
    id_return;
    return;
    id_product;
    id_sale_item;
    disabled_at;
    disabled_by;
    deleted_at;
    deleted_by;
};
exports.ReturnItem = ReturnItem;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], ReturnItem.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true }),
    __metadata("design:type", Number)
], ReturnItem.prototype, "id_store", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => return_entity_1.Return),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], ReturnItem.prototype, "id_return", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => return_entity_1.Return),
    __metadata("design:type", return_entity_1.Return)
], ReturnItem.prototype, "return", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], ReturnItem.prototype, "id_product", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], ReturnItem.prototype, "id_sale_item", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true }),
    __metadata("design:type", Object)
], ReturnItem.prototype, "disabled_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true }),
    __metadata("design:type", Object)
], ReturnItem.prototype, "disabled_by", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true }),
    __metadata("design:type", Object)
], ReturnItem.prototype, "deleted_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true }),
    __metadata("design:type", Object)
], ReturnItem.prototype, "deleted_by", void 0);
exports.ReturnItem = ReturnItem = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'return_items',
        timestamps: false,
    })
], ReturnItem);
//# sourceMappingURL=return-item.entity.js.map