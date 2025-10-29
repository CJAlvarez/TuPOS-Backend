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
exports.SaleController = void 0;
const common_1 = require("@nestjs/common");
const create_sale_dto_1 = require("./dto/create-sale.dto");
const update_sale_dto_1 = require("./dto/update-sale.dto");
const get_sales_query_dto_1 = require("./dto/get-sales-query.dto");
const update_sale_status_dto_1 = require("./dto/update-sale-status.dto");
const swagger_1 = require("@nestjs/swagger");
const sale_entity_1 = require("../entities/sale.entity");
const sale_service_1 = require("./sale.service");
const verify_token_guard_1 = require("../auth/guards/verify-token.guard");
const verify_disabled_user_guard_1 = require("../auth/guards/verify-disabled-user.guard");
const verify_admin_admin_guard_1 = require("../auth/guards/verify-admin-admin.guard");
let SaleController = class SaleController {
    saleService;
    constructor(saleService) {
        this.saleService = saleService;
    }
    findAll(req, query) {
        return this.saleService.findAll(query, req.internal_store_id);
    }
    findOne(id) {
        return this.saleService.findOne(Number(id));
    }
    create(req, data) {
        return this.saleService.create(req.internal_user_id, req.internal_store_id, data);
    }
    update(dto) {
        return this.saleService.update(dto);
    }
    remove(req, id) {
        return this.saleService.remove(req.internal_user_id, Number(id));
    }
    updateStatus(req, dto) {
        return this.saleService.updateStatus(req.internal_user_id, dto);
    }
};
exports.SaleController = SaleController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las ventas (paginado y búsqueda)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de ventas paginada', type: Object }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_sales_query_dto_1.GetSalesQueryDto]),
    __metadata("design:returntype", Promise)
], SaleController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una venta por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Venta encontrada', type: sale_entity_1.Sale }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Venta no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SaleController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una venta' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Venta creada', type: sale_entity_1.Sale }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_sale_dto_1.CreateSaleDto]),
    __metadata("design:returntype", Promise)
], SaleController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar una venta' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Venta actualizada', type: sale_entity_1.Sale }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_sale_dto_1.UpdateSaleDto]),
    __metadata("design:returntype", Promise)
], SaleController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una venta (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Venta eliminada' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SaleController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)('status'),
    (0, swagger_1.ApiOperation)({ summary: 'Habilitar o deshabilitar venta' }),
    (0, swagger_1.ApiBody)({ type: update_sale_status_dto_1.UpdateSaleStatusDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estado de venta actualizado' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_sale_status_dto_1.UpdateSaleStatusDto]),
    __metadata("design:returntype", Promise)
], SaleController.prototype, "updateStatus", null);
exports.SaleController = SaleController = __decorate([
    (0, swagger_1.ApiTags)('sales'),
    (0, common_1.Controller)('sales'),
    (0, common_1.UseGuards)(verify_token_guard_1.VerifyTokenGuard, verify_disabled_user_guard_1.VerifyDisabledUserGuard, verify_admin_admin_guard_1.VerifyAdminAdminGuard),
    __metadata("design:paramtypes", [sale_service_1.SaleService])
], SaleController);
//# sourceMappingURL=sale.controller.js.map