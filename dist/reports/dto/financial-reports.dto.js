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
exports.DailyOutcomeResponseDto = exports.DailyOutcomeRequestDto = exports.DailyIncomeResponseDto = exports.DailyIncomeRequestDto = exports.YearlyTrendResponseDto = exports.YearlyTrendRequestDto = exports.MonthlyTrendResponseDto = exports.MonthlyTrendRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_report_dto_1 = require("./base-report.dto");
class MonthlyTrendRequestDto extends base_report_dto_1.BaseReportRequestDto {
}
exports.MonthlyTrendRequestDto = MonthlyTrendRequestDto;
class MonthlyTrendResponseDto extends base_report_dto_1.BaseReportResponseDto {
}
exports.MonthlyTrendResponseDto = MonthlyTrendResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Datos de tendencia mensual',
        type: 'object',
        properties: {
            months: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        month: { type: 'string' },
                        income: { type: 'number' },
                        outcome: { type: 'number' },
                    }
                }
            }
        }
    }),
    __metadata("design:type", Object)
], MonthlyTrendResponseDto.prototype, "data", void 0);
class YearlyTrendRequestDto extends base_report_dto_1.BaseReportRequestDto {
}
exports.YearlyTrendRequestDto = YearlyTrendRequestDto;
class YearlyTrendResponseDto extends base_report_dto_1.BaseReportResponseDto {
}
exports.YearlyTrendResponseDto = YearlyTrendResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Datos de tendencia anual',
        type: 'object',
        properties: {
            years: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        year: { type: 'string' },
                        income: { type: 'number' },
                        outcome: { type: 'number' },
                        balance: { type: 'number' }
                    }
                }
            }
        }
    }),
    __metadata("design:type", Object)
], YearlyTrendResponseDto.prototype, "data", void 0);
class DailyIncomeRequestDto extends base_report_dto_1.BaseReportRequestDto {
}
exports.DailyIncomeRequestDto = DailyIncomeRequestDto;
class DailyIncomeResponseDto extends base_report_dto_1.BaseReportResponseDto {
}
exports.DailyIncomeResponseDto = DailyIncomeResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ingresos del día',
        type: 'object',
        properties: {
            total: { type: 'number' },
            date: { type: 'string' },
        }
    }),
    __metadata("design:type", Object)
], DailyIncomeResponseDto.prototype, "data", void 0);
class DailyOutcomeRequestDto extends base_report_dto_1.BaseReportRequestDto {
}
exports.DailyOutcomeRequestDto = DailyOutcomeRequestDto;
class DailyOutcomeResponseDto extends base_report_dto_1.BaseReportResponseDto {
}
exports.DailyOutcomeResponseDto = DailyOutcomeResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Egresos del día',
        type: 'object',
        properties: {
            total: { type: 'number' },
            date: { type: 'string' },
        }
    }),
    __metadata("design:type", Object)
], DailyOutcomeResponseDto.prototype, "data", void 0);
//# sourceMappingURL=financial-reports.dto.js.map