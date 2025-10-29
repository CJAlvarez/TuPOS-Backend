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
exports.Client = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_entity_1 = require("./user.entity");
const profile_entity_1 = require("./profile.entity");
let Client = class Client extends sequelize_typescript_1.Model {
    profile;
    user;
    id_user;
    id_store;
    loyalty_eligible;
    disabled_at;
    disabled_by;
    deleted_at;
    deleted_by;
};
exports.Client = Client;
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => profile_entity_1.Profile, { foreignKey: 'id_user', as: 'profile' }),
    __metadata("design:type", profile_entity_1.Profile)
], Client.prototype, "profile", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_entity_1.User, 'id_user'),
    __metadata("design:type", user_entity_1.User)
], Client.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, primaryKey: true }),
    __metadata("design:type", Number)
], Client.prototype, "id_user", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true }),
    __metadata("design:type", Number)
], Client.prototype, "id_store", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true, defaultValue: 2 }),
    __metadata("design:type", Number)
], Client.prototype, "loyalty_eligible", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true }),
    __metadata("design:type", Object)
], Client.prototype, "disabled_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true }),
    __metadata("design:type", Object)
], Client.prototype, "disabled_by", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true }),
    __metadata("design:type", Date)
], Client.prototype, "deleted_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true }),
    __metadata("design:type", Number)
], Client.prototype, "deleted_by", void 0);
exports.Client = Client = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'clients', timestamps: false })
], Client);
//# sourceMappingURL=client.entity.js.map