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
exports.StoreController = void 0;
const common_1 = require("@nestjs/common");
const create_store_dto_1 = require("./dto/create-store.dto");
const update_store_dto_1 = require("./dto/update-store.dto");
const get_stores_query_dto_1 = require("./dto/get-stores-query.dto");
const update_store_status_dto_1 = require("./dto/update-store-status.dto");
const swagger_1 = require("@nestjs/swagger");
const store_entity_1 = require("../entities/store.entity");
const store_service_1 = require("./store.service");
const verify_token_guard_1 = require("../auth/guards/verify-token.guard");
const verify_disabled_user_guard_1 = require("../auth/guards/verify-disabled-user.guard");
const verify_admin_admin_guard_1 = require("../auth/guards/verify-admin-admin.guard");
let StoreController = class StoreController {
    storeService;
    constructor(storeService) {
        this.storeService = storeService;
    }
    findAll(req, query) {
        return this.storeService.findAll(query);
    }
    findOne(id) {
        return this.storeService.findOne(Number(id));
    }
    create(req, data) {
        return this.storeService.create(req.internal_user_id, data);
    }
    update(dto) {
        return this.storeService.update(dto);
    }
    remove(req, id) {
        return this.storeService.remove(req.internal_user_id, Number(id));
    }
    updateStatus(req, dto) {
        return this.storeService.updateStatus(req.internal_user_id, dto);
    }
};
exports.StoreController = StoreController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las tiendas (paginado y búsqueda)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de tiendas paginada', type: Object }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_stores_query_dto_1.GetStoresQueryDto]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una tienda por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tienda encontrada', type: store_entity_1.Store }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tienda no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una tienda' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Tienda creada', type: store_entity_1.Store }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_store_dto_1.CreateStoreDto]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar una tienda' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tienda actualizada', type: store_entity_1.Store }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_store_dto_1.UpdateStoreDto]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una tienda (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tienda eliminada' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)('status'),
    (0, swagger_1.ApiOperation)({ summary: 'Habilitar o deshabilitar tienda' }),
    (0, swagger_1.ApiBody)({ type: update_store_status_dto_1.UpdateStoreStatusDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estado de tienda actualizado' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_store_status_dto_1.UpdateStoreStatusDto]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "updateStatus", null);
exports.StoreController = StoreController = __decorate([
    (0, swagger_1.ApiTags)('stores'),
    (0, common_1.Controller)('stores'),
    (0, common_1.UseGuards)(verify_token_guard_1.VerifyTokenGuard, verify_disabled_user_guard_1.VerifyDisabledUserGuard, verify_admin_admin_guard_1.VerifyAdminAdminGuard),
    __metadata("design:paramtypes", [store_service_1.StoreService])
], StoreController);
//# sourceMappingURL=store.controller.js.map