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
exports.BaseReportResponseDto = exports.BaseReportRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class BaseReportRequestDto {
    startDate;
    endDate;
    id_store;
}
exports.BaseReportRequestDto = BaseReportRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de inicio para el reporte (formato YYYY-MM-DD)',
        required: false,
        example: '2024-01-01'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], BaseReportRequestDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de fin para el reporte (formato YYYY-MM-DD)',
        required: false,
        example: '2024-12-31'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], BaseReportRequestDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID de la tienda' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], BaseReportRequestDto.prototype, "id_store", void 0);
class BaseReportResponseDto {
    reportCode;
    reportName;
    generatedAt;
    reportType;
    data;
}
exports.BaseReportResponseDto = BaseReportResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Código del reporte' }),
    __metadata("design:type", String)
], BaseReportResponseDto.prototype, "reportCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre del reporte' }),
    __metadata("design:type", String)
], BaseReportResponseDto.prototype, "reportName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de generación del reporte' }),
    __metadata("design:type", Date)
], BaseReportResponseDto.prototype, "generatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tipo de reporte (PREPROCESSED o IMMEDIATE)' }),
    __metadata("design:type", String)
], BaseReportResponseDto.prototype, "reportType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Datos del reporte' }),
    __metadata("design:type", Object)
], BaseReportResponseDto.prototype, "data", void 0);
//# sourceMappingURL=base-report.dto.js.map