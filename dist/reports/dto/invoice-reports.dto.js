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
exports.LatestInvoicesResponseDto = exports.LatestInvoicesRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_report_dto_1 = require("./base-report.dto");
class LatestInvoicesRequestDto extends base_report_dto_1.BaseReportRequestDto {
}
exports.LatestInvoicesRequestDto = LatestInvoicesRequestDto;
class LatestInvoicesResponseDto extends base_report_dto_1.BaseReportResponseDto {
}
exports.LatestInvoicesResponseDto = LatestInvoicesResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Últimos 5 recibos',
        type: 'object',
        properties: {
            invoices: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        client: { type: 'string' },
                        total: { type: 'number' },
                        title: { type: 'string' },
                        number: { type: 'string' },
                        date: { type: 'string' },
                    },
                },
            },
        },
    }),
    __metadata("design:type", Object)
], LatestInvoicesResponseDto.prototype, "data", void 0);
//# sourceMappingURL=invoice-reports.dto.js.map