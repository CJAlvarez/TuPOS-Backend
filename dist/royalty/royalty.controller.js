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
exports.RoyaltyController = void 0;
const common_1 = require("@nestjs/common");
const create_royalty_dto_1 = require("./dto/create-royalty.dto");
const update_royalty_dto_1 = require("./dto/update-royalty.dto");
const get_royalties_query_dto_1 = require("./dto/get-royalties-query.dto");
const update_royalty_status_dto_1 = require("./dto/update-royalty-status.dto");
const swagger_1 = require("@nestjs/swagger");
const royalty_entity_1 = require("../entities/royalty.entity");
const royalty_service_1 = require("./royalty.service");
const verify_token_guard_1 = require("../auth/guards/verify-token.guard");
const verify_disabled_user_guard_1 = require("../auth/guards/verify-disabled-user.guard");
const verify_admin_admin_guard_1 = require("../auth/guards/verify-admin-admin.guard");
let RoyaltyController = class RoyaltyController {
    royaltyService;
    constructor(royaltyService) {
        this.royaltyService = royaltyService;
    }
    findAll(req, query) {
        return this.royaltyService.findAll(query, req.internal_store_id);
    }
    findOne(id) {
        return this.royaltyService.findOne(Number(id));
    }
    create(req, data) {
        return this.royaltyService.create(req.internal_user_id, req.internal_store_id, data);
    }
    update(dto) {
        return this.royaltyService.update(dto);
    }
    remove(req, id) {
        return this.royaltyService.remove(req.internal_user_id, Number(id));
    }
    updateStatus(req, dto) {
        return this.royaltyService.updateStatus(req.internal_user_id, dto);
    }
};
exports.RoyaltyController = RoyaltyController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los registros de lealtad (paginado y búsqueda)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de registros de lealtad paginada', type: Object }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_royalties_query_dto_1.GetRoyaltiesQueryDto]),
    __metadata("design:returntype", Promise)
], RoyaltyController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una lealtad por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'lealtad encontrada', type: royalty_entity_1.Royalty }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'lealtad no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoyaltyController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una lealtad' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'lealtad creada', type: royalty_entity_1.Royalty }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_royalty_dto_1.CreateRoyaltyDto]),
    __metadata("design:returntype", Promise)
], RoyaltyController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar una lealtad' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'lealtad actualizada', type: royalty_entity_1.Royalty }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_royalty_dto_1.UpdateRoyaltyDto]),
    __metadata("design:returntype", Promise)
], RoyaltyController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una lealtad (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'lealtad eliminada' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RoyaltyController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)('status'),
    (0, swagger_1.ApiOperation)({ summary: 'Habilitar o deshabilitar lealtad' }),
    (0, swagger_1.ApiBody)({ type: update_royalty_status_dto_1.UpdateRoyaltyStatusDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estado de lealtad actualizado' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_royalty_status_dto_1.UpdateRoyaltyStatusDto]),
    __metadata("design:returntype", Promise)
], RoyaltyController.prototype, "updateStatus", null);
exports.RoyaltyController = RoyaltyController = __decorate([
    (0, swagger_1.ApiTags)('royalties'),
    (0, common_1.Controller)('royalties'),
    (0, common_1.UseGuards)(verify_token_guard_1.VerifyTokenGuard, verify_disabled_user_guard_1.VerifyDisabledUserGuard, verify_admin_admin_guard_1.VerifyAdminAdminGuard),
    __metadata("design:paramtypes", [royalty_service_1.RoyaltyService])
], RoyaltyController);
//# sourceMappingURL=royalty.controller.js.map