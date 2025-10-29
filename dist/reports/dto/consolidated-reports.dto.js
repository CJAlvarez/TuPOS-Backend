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
exports.ConsolidatedReportsResponseDto = exports.ConsolidatedReportsRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ConsolidatedReportsRequestDto {
    startDate;
    endDate;
}
exports.ConsolidatedReportsRequestDto = ConsolidatedReportsRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de inicio para reportes con rango de fechas (YYYY-MM-DD)',
        required: false,
        example: '2024-01-01'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ConsolidatedReportsRequestDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de fin para reportes con rango de fechas (YYYY-MM-DD)',
        required: false,
        example: '2024-12-31'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ConsolidatedReportsRequestDto.prototype, "endDate", void 0);
class ConsolidatedReportsResponseDto {
    financial;
    clients;
    transactions;
    invoices;
    generatedAt;
}
exports.ConsolidatedReportsResponseDto = ConsolidatedReportsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reportes financieros consolidados'
    }),
    __metadata("design:type", Object)
], ConsolidatedReportsResponseDto.prototype, "financial", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reportes de clientes consolidados'
    }),
    __metadata("design:type", Object)
], ConsolidatedReportsResponseDto.prototype, "clients", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reportes de transacciones consolidados'
    }),
    __metadata("design:type", Object)
], ConsolidatedReportsResponseDto.prototype, "transactions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reportes de facturas consolidados'
    }),
    __metadata("design:type", Object)
], ConsolidatedReportsResponseDto.prototype, "invoices", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp de cuando se generó el reporte consolidado',
        example: '2024-01-15T10:30:00Z'
    }),
    __metadata("design:type", String)
], ConsolidatedReportsResponseDto.prototype, "generatedAt", void 0);
//# sourceMappingURL=consolidated-reports.dto.js.map