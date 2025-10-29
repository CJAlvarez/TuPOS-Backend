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
exports.TopTransactionsResponseDto = exports.TopTransactionsRequestDto = exports.LatestTransactionsResponseDto = exports.LatestTransactionsRequestDto = exports.MonthlyInterestsResponseDto = exports.MonthlyInterestsRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_report_dto_1 = require("./base-report.dto");
class MonthlyInterestsRequestDto extends base_report_dto_1.BaseReportRequestDto {
}
exports.MonthlyInterestsRequestDto = MonthlyInterestsRequestDto;
class MonthlyInterestsResponseDto extends base_report_dto_1.BaseReportResponseDto {
}
exports.MonthlyInterestsResponseDto = MonthlyInterestsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Intereses generados en el mes',
        type: 'object',
        properties: {
            totalInterests: { type: 'number' },
            month: { type: 'string' },
        }
    }),
    __metadata("design:type", Object)
], MonthlyInterestsResponseDto.prototype, "data", void 0);
class LatestTransactionsRequestDto extends base_report_dto_1.BaseReportRequestDto {
}
exports.LatestTransactionsRequestDto = LatestTransactionsRequestDto;
class LatestTransactionsResponseDto extends base_report_dto_1.BaseReportResponseDto {
}
exports.LatestTransactionsResponseDto = LatestTransactionsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Últimas 5 transacciones',
        type: 'object',
        properties: {
            transactions: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        walletId: { type: 'number' },
                        walletNumber: { type: 'string' },
                        eventType: { type: 'string' },
                        clientName: { type: 'string' },
                        amount: { type: 'number' },
                        balance: { type: 'number' },
                        date: { type: 'string' }
                    }
                }
            }
        }
    }),
    __metadata("design:type", Object)
], LatestTransactionsResponseDto.prototype, "data", void 0);
class TopTransactionsRequestDto extends base_report_dto_1.BaseReportRequestDto {
}
exports.TopTransactionsRequestDto = TopTransactionsRequestDto;
class TopTransactionsResponseDto extends base_report_dto_1.BaseReportResponseDto {
}
exports.TopTransactionsResponseDto = TopTransactionsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Top 10 transacciones por balance',
        type: 'object',
        properties: {
            transactions: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        walletId: { type: 'number' },
                        walletNumber: { type: 'string' },
                        eventType: { type: 'string' },
                        clientName: { type: 'string' },
                        amount: { type: 'number' },
                        balance: { type: 'number' },
                        date: { type: 'string' }
                    }
                }
            }
        }
    }),
    __metadata("design:type", Object)
], TopTransactionsResponseDto.prototype, "data", void 0);
//# sourceMappingURL=transaction-reports.dto.js.map