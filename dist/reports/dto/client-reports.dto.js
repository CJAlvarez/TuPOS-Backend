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
exports.LoanCountResponseDto = exports.LoanCountRequestDto = exports.WalletCountResponseDto = exports.WalletCountRequestDto = exports.ClientCountResponseDto = exports.ClientCountRequestDto = exports.TopClientsResponseDto = exports.TopClientsRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_report_dto_1 = require("./base-report.dto");
class TopClientsRequestDto extends base_report_dto_1.BaseReportRequestDto {
}
exports.TopClientsRequestDto = TopClientsRequestDto;
class TopClientsResponseDto extends base_report_dto_1.BaseReportResponseDto {
}
exports.TopClientsResponseDto = TopClientsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Clientes con más movimientos',
        type: 'object',
        properties: {
            clients: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        clientId: { type: 'number' },
                        clientName: { type: 'string' },
                        movementCount: { type: 'number' },
                        totalAmount: { type: 'number' }
                    }
                }
            }
        }
    }),
    __metadata("design:type", Object)
], TopClientsResponseDto.prototype, "data", void 0);
class ClientCountRequestDto extends base_report_dto_1.BaseReportRequestDto {
}
exports.ClientCountRequestDto = ClientCountRequestDto;
class ClientCountResponseDto extends base_report_dto_1.BaseReportResponseDto {
}
exports.ClientCountResponseDto = ClientCountResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cantidad total de clientes',
        type: 'object',
        properties: {
            totalClients: { type: 'number' },
            activeClients: { type: 'number' },
            inactiveClients: { type: 'number' }
        }
    }),
    __metadata("design:type", Object)
], ClientCountResponseDto.prototype, "data", void 0);
class WalletCountRequestDto extends base_report_dto_1.BaseReportRequestDto {
}
exports.WalletCountRequestDto = WalletCountRequestDto;
class WalletCountResponseDto extends base_report_dto_1.BaseReportResponseDto {
}
exports.WalletCountResponseDto = WalletCountResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cantidad total de wallets',
        type: 'object',
        properties: {
            totalWallets: { type: 'number' },
            activeWallets: { type: 'number' },
            totalBalance: { type: 'number' }
        }
    }),
    __metadata("design:type", Object)
], WalletCountResponseDto.prototype, "data", void 0);
class LoanCountRequestDto extends base_report_dto_1.BaseReportRequestDto {
}
exports.LoanCountRequestDto = LoanCountRequestDto;
class LoanCountResponseDto extends base_report_dto_1.BaseReportResponseDto {
}
exports.LoanCountResponseDto = LoanCountResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cantidad total de préstamos',
        type: 'object',
        properties: {
            totalLoans: { type: 'number' },
            activeLoans: { type: 'number' },
            totalAmount: { type: 'number' },
            pendingAmount: { type: 'number' }
        }
    }),
    __metadata("design:type", Object)
], LoanCountResponseDto.prototype, "data", void 0);
//# sourceMappingURL=client-reports.dto.js.map