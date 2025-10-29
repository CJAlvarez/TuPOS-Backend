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
exports.CatalogVersion = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let CatalogVersion = class CatalogVersion extends sequelize_typescript_1.Model {
};
exports.CatalogVersion = CatalogVersion;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], CatalogVersion.prototype, "key", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        field: 'catalog_version',
    }),
    __metadata("design:type", Date)
], CatalogVersion.prototype, "catalog_version", void 0);
exports.CatalogVersion = CatalogVersion = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'catalog_versions',
        timestamps: false,
    })
], CatalogVersion);
//# sourceMappingURL=catalog-version.entity.js.map