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
exports.SaleItemController = void 0;
const common_1 = require("@nestjs/common");
const create_sale_item_dto_1 = require("./dto/create-sale-item.dto");
const update_sale_item_dto_1 = require("./dto/update-sale-item.dto");
const get_sale_items_query_dto_1 = require("./dto/get-sale-items-query.dto");
const update_sale_item_status_dto_1 = require("./dto/update-sale-item-status.dto");
const swagger_1 = require("@nestjs/swagger");
const sale_item_entity_1 = require("../entities/sale-item.entity");
const sale_item_service_1 = require("./sale-item.service");
const verify_token_guard_1 = require("../auth/guards/verify-token.guard");
const verify_disabled_user_guard_1 = require("../auth/guards/verify-disabled-user.guard");
const verify_admin_admin_guard_1 = require("../auth/guards/verify-admin-admin.guard");
let SaleItemController = class SaleItemController {
    saleItemService;
    constructor(saleItemService) {
        this.saleItemService = saleItemService;
    }
    findAll(req, query) {
        return this.saleItemService.findAll(query, req.internal_store_id);
    }
    findOne(id) {
        return this.saleItemService.findOne(Number(id));
    }
    create(req, data) {
        return this.saleItemService.create(req.internal_user_id, req.internal_store_id, data);
    }
    update(dto) {
        return this.saleItemService.update(dto);
    }
    remove(req, id) {
        return this.saleItemService.remove(req.internal_user_id, Number(id));
    }
    updateStatus(req, dto) {
        return this.saleItemService.updateStatus(req.internal_user_id, dto);
    }
};
exports.SaleItemController = SaleItemController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los items de venta (paginado y búsqueda)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de items de venta paginada', type: Object }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_sale_items_query_dto_1.GetSaleItemsQueryDto]),
    __metadata("design:returntype", Promise)
], SaleItemController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un item de venta por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item de venta encontrado', type: sale_item_entity_1.SaleItem }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Item de venta no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SaleItemController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un item de venta' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Item de venta creado', type: sale_item_entity_1.SaleItem }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_sale_item_dto_1.CreateSaleItemDto]),
    __metadata("design:returntype", Promise)
], SaleItemController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un item de venta' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item de venta actualizado', type: sale_item_entity_1.SaleItem }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_sale_item_dto_1.UpdateSaleItemDto]),
    __metadata("design:returntype", Promise)
], SaleItemController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un item de venta (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item de venta eliminado' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SaleItemController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)('status'),
    (0, swagger_1.ApiOperation)({ summary: 'Habilitar o deshabilitar item de venta' }),
    (0, swagger_1.ApiBody)({ type: update_sale_item_status_dto_1.UpdateSaleItemStatusDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estado de item de venta actualizado' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_sale_item_status_dto_1.UpdateSaleItemStatusDto]),
    __metadata("design:returntype", Promise)
], SaleItemController.prototype, "updateStatus", null);
exports.SaleItemController = SaleItemController = __decorate([
    (0, swagger_1.ApiTags)('sale-items'),
    (0, common_1.Controller)('sale-items'),
    (0, common_1.UseGuards)(verify_token_guard_1.VerifyTokenGuard, verify_disabled_user_guard_1.VerifyDisabledUserGuard, verify_admin_admin_guard_1.VerifyAdminAdminGuard),
    __metadata("design:paramtypes", [sale_item_service_1.SaleItemService])
], SaleItemController);
//# sourceMappingURL=sale-item.controller.js.map