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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reports_service_1 = require("./reports.service");
const verify_token_guard_1 = require("../auth/guards/verify-token.guard");
const verify_disabled_user_guard_1 = require("../auth/guards/verify-disabled-user.guard");
const verify_admin_admin_guard_1 = require("../auth/guards/verify-admin-admin.guard");
const daily_sales_reports_dto_1 = require("./dto/daily-sales-reports.dto");
const inventory_low_reports_dto_1 = require("./dto/inventory-low-reports.dto");
const inventory_expiring_reports_dto_1 = require("./dto/inventory-expiring-reports.dto");
let ReportsController = class ReportsController {
    reportsService;
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    async getDailySales(req, dto) {
        return await this.reportsService.getDailySales(dto, req.internal_store_id);
    }
    async getInventoryLow(req, dto) {
        return await this.reportsService.getInventoryLow(dto, req.internal_store_id);
    }
    async getInventoryExpiring(req, dto) {
        return await this.reportsService.getInventoryExpiring(dto, req.internal_store_id);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('daily-sales'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener ventas del día',
        description: 'Reporte de cálculo inmediato',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Ventas del día obtenidas exitosamente',
        type: daily_sales_reports_dto_1.DailySalesResponseDto,
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, daily_sales_reports_dto_1.DailySalesRequestDto]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getDailySales", null);
__decorate([
    (0, common_1.Get)('inventory-low'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener inventario bajo',
        description: 'Reporte de cálculo inmediato',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Inventario bajo obtenido exitosamente',
        type: inventory_low_reports_dto_1.InventoryLowResponseDto,
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, inventory_low_reports_dto_1.InventoryLowRequestDto]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getInventoryLow", null);
__decorate([
    (0, common_1.Get)('inventory-expiring'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener inventario por vencer',
        description: 'Reporte de cálculo inmediato',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Inventario por vencer obtenido exitosamente',
        type: inventory_expiring_reports_dto_1.InventoryExpiringResponseDto,
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, inventory_expiring_reports_dto_1.InventoryExpiringRequestDto]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getInventoryExpiring", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)('reports'),
    (0, common_1.Controller)('reports'),
    (0, common_1.UseGuards)(verify_token_guard_1.VerifyTokenGuard, verify_disabled_user_guard_1.VerifyDisabledUserGuard, verify_admin_admin_guard_1.VerifyAdminAdminGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map