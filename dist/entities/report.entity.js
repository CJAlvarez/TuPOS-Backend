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
exports.Report = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let Report = class Report extends sequelize_typescript_1.Model {
    id_store;
    name;
    code;
    type;
    frequency_pattern;
    last_execution;
    parameters;
    last_results;
    is_active;
};
exports.Report = Report;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], Report.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true }),
    __metadata("design:type", Number)
], Report.prototype, "id_store", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false }),
    __metadata("design:type", String)
], Report.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false, unique: true }),
    __metadata("design:type", String)
], Report.prototype, "code", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('PREPROCESSED', 'IMMEDIATE'),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Report.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(10),
        allowNull: true,
        comment: 'Patrón de frecuencia: H24=24hrs, D7=7días, W1=semanal, M1=mensual, Y1=anual',
    }),
    __metadata("design:type", String)
], Report.prototype, "frequency_pattern", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        comment: 'Última ejecución del reporte',
    }),
    __metadata("design:type", Date)
], Report.prototype, "last_execution", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: true,
        comment: 'Parámetros de configuración del reporte',
    }),
    __metadata("design:type", Object)
], Report.prototype, "parameters", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: true,
        comment: 'Últimos resultados para reportes preprocesados',
    }),
    __metadata("design:type", Object)
], Report.prototype, "last_results", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true }),
    __metadata("design:type", Boolean)
], Report.prototype, "is_active", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'created_at' }),
    __metadata("design:type", Date)
], Report.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'updated_at' }),
    __metadata("design:type", Date)
], Report.prototype, "updatedAt", void 0);
exports.Report = Report = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'reports',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    })
], Report);
//# sourceMappingURL=report.entity.js.map