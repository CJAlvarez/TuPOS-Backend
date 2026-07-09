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
exports.MonthlySalesResponseDto = exports.MonthlySalesRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const base_report_dto_1 = require("./base-report.dto");
class MonthlySalesRequestDto {
    month;
    year;
    mode;
}
exports.MonthlySalesRequestDto = MonthlySalesRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Mes del reporte (1-12)', example: 7 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(12),
    __metadata("design:type", Number)
], MonthlySalesRequestDto.prototype, "month", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Año del reporte', example: 2026 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], MonthlySalesRequestDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Formato del reporte: resumen agregado por día o detalle de cada venta',
        enum: ['summary', 'detailed'],
        example: 'summary',
    }),
    (0, class_validator_1.IsIn)(['summary', 'detailed']),
    __metadata("design:type", String)
], MonthlySalesRequestDto.prototype, "mode", void 0);
class MonthlySalesResponseDto extends base_report_dto_1.BaseReportResponseDto {
}
exports.MonthlySalesResponseDto = MonthlySalesResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ventas del mes, agregadas por día (mode=summary) o detalladas (mode=detailed)',
        type: 'object',
        properties: {
            sales: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        date: { type: 'string' },
                        number: { type: 'string' },
                        sales_count: { type: 'number' },
                        subtotal: { type: 'number' },
                        discount_total: { type: 'number' },
                        tax_total: { type: 'number' },
                        total: { type: 'number' },
                    },
                },
            },
        },
    }),
    __metadata("design:type", Array)
], MonthlySalesResponseDto.prototype, "data", void 0);
//# sourceMappingURL=monthly-sales-reports.dto.js.map