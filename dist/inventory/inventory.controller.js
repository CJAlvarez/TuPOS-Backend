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
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const create_inventory_dto_1 = require("./dto/create-inventory.dto");
const update_inventory_dto_1 = require("./dto/update-inventory.dto");
const get_inventory_query_dto_1 = require("./dto/get-inventory-query.dto");
const swagger_1 = require("@nestjs/swagger");
const inventory_entity_1 = require("../entities/inventory.entity");
const inventory_service_1 = require("./inventory.service");
const verify_token_guard_1 = require("../auth/guards/verify-token.guard");
const verify_disabled_user_guard_1 = require("../auth/guards/verify-disabled-user.guard");
const verify_admin_admin_guard_1 = require("../auth/guards/verify-admin-admin.guard");
let InventoryController = class InventoryController {
    inventoryService;
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    findAll(req, query) {
        return this.inventoryService.findAll(query, req.internal_store_id);
    }
    findOne(id) {
        return this.inventoryService.findOne(Number(id));
    }
    create(req, data) {
        return this.inventoryService.create(req.internal_user_id, req.internal_store_id, data);
    }
    update(dto) {
        return this.inventoryService.update(dto);
    }
    remove(req, id) {
        return this.inventoryService.remove(req.internal_user_id, Number(id));
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los registros de inventario (paginado y búsqueda)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de inventario paginada', type: Object }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_inventory_query_dto_1.GetInventoryQueryDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un registro de inventario por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Inventario encontrado', type: inventory_entity_1.Inventory }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Inventario no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un registro de inventario' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Inventario creado', type: inventory_entity_1.Inventory }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_inventory_dto_1.CreateInventoryDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un registro de inventario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Inventario actualizado', type: inventory_entity_1.Inventory }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_inventory_dto_1.UpdateInventoryDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un registro de inventario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Inventario eliminado' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "remove", null);
exports.InventoryController = InventoryController = __decorate([
    (0, swagger_1.ApiTags)('inventory'),
    (0, common_1.Controller)('inventory'),
    (0, common_1.UseGuards)(verify_token_guard_1.VerifyTokenGuard, verify_disabled_user_guard_1.VerifyDisabledUserGuard, verify_admin_admin_guard_1.VerifyAdminAdminGuard),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map