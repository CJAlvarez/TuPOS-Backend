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
exports.User = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const profile_entity_1 = require("./profile.entity");
const client_entity_1 = require("./client.entity");
const admin_entity_1 = require("./admin.entity");
let User = class User extends sequelize_typescript_1.Model {
    profile;
    client;
    admin;
    username;
    password;
    email;
    restoreCode;
    firstLogin;
    steps2;
    createdBy;
};
exports.User = User;
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => profile_entity_1.Profile, { foreignKey: 'id_user', as: 'profile' }),
    __metadata("design:type", profile_entity_1.Profile)
], User.prototype, "profile", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => client_entity_1.Client, { foreignKey: 'id_user', as: 'client' }),
    __metadata("design:type", client_entity_1.Client)
], User.prototype, "client", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => admin_entity_1.Admin, { foreignKey: 'id_user', as: 'admin' }),
    __metadata("design:type", admin_entity_1.Admin)
], User.prototype, "admin", void 0);
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'id_user',
    }),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
        field: 'restore_code',
    }),
    __metadata("design:type", Object)
], User.prototype, "restoreCode", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: true,
        field: 'first_login',
        defaultValue: false,
    }),
    __metadata("design:type", Object)
], User.prototype, "firstLogin", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: true,
        field: 'steps_2',
        defaultValue: false,
    }),
    __metadata("design:type", Object)
], User.prototype, "steps2", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        field: 'created_by',
    }),
    __metadata("design:type", Object)
], User.prototype, "createdBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.NOW),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        field: 'created_at',
    }),
    __metadata("design:type", Object)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        field: 'disabled_at',
    }),
    __metadata("design:type", Object)
], User.prototype, "disabledAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        field: 'disabled_by',
    }),
    __metadata("design:type", Object)
], User.prototype, "disabledBy", void 0);
exports.User = User = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'users', timestamps: false })
], User);
//# sourceMappingURL=user.entity.js.map