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
exports.ReturnsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const returns_service_1 = require("./returns.service");
const create_return_dto_1 = require("./dto/create-return.dto");
const update_return_dto_1 = require("./dto/update-return.dto");
const get_returns_query_dto_1 = require("./dto/get-returns-query.dto");
const update_return_status_dto_1 = require("./dto/update-return-status.dto");
const verify_token_guard_1 = require("../auth/guards/verify-token.guard");
const verify_disabled_user_guard_1 = require("../auth/guards/verify-disabled-user.guard");
const verify_admin_admin_guard_1 = require("../auth/guards/verify-admin-admin.guard");
const get_products_query_dto_1 = require("./dto/get-products-query.dto");
let ReturnsController = class ReturnsController {
    returnsService;
    constructor(returnsService) {
        this.returnsService = returnsService;
    }
    async create(dto, req) {
        return this.returnsService.create(dto, req.internal_user_id, req.internal_store_id);
    }
    async findAll(req, query) {
        return this.returnsService.findAll(query, req.internal_store_id);
    }
    async getProducts(query) {
        return this.returnsService.getProducts(query);
    }
    async findOne(id) {
        return this.returnsService.findOne(Number(id));
    }
    async update(dto, req) {
        return this.returnsService.update(dto, req.internal_user_id);
    }
    async remove(id, req) {
        return this.returnsService.remove(req.internal_user_id, Number(id));
    }
    async updateStatus(dto, req) {
        return this.returnsService.updateStatus(req.internal_user_id, dto);
    }
};
exports.ReturnsController = ReturnsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Crear devolución' }),
    (0, swagger_1.ApiBody)({ type: create_return_dto_1.CreateReturnDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Devolución creada exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_return_dto_1.CreateReturnDto, Object]),
    __metadata("design:returntype", Promise)
], ReturnsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Listar devoluciones' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista paginada de devoluciones' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_returns_query_dto_1.GetReturnsQueryDto]),
    __metadata("design:returntype", Promise)
], ReturnsController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Listar productos de devolución' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de productos de devolución' }),
    (0, common_1.Get)('products'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_products_query_dto_1.GetProductsQueryDto]),
    __metadata("design:returntype", Promise)
], ReturnsController.prototype, "getProducts", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obtener devolución por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Devolución encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Devolución no encontrada' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReturnsController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar devolución' }),
    (0, swagger_1.ApiBody)({ type: update_return_dto_1.UpdateReturnDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Devolución actualizada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Devolución no encontrada' }),
    (0, common_1.Put)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_return_dto_1.UpdateReturnDto, Object]),
    __metadata("design:returntype", Promise)
], ReturnsController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar devolución (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Devolución eliminada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Devolución no encontrada' }),
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReturnsController.prototype, "remove", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Cambiar estado de devolución' }),
    (0, swagger_1.ApiBody)({ type: update_return_status_dto_1.UpdateReturnStatusDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estado actualizado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Devolución no encontrada' }),
    (0, common_1.Put)('status'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_return_status_dto_1.UpdateReturnStatusDto, Object]),
    __metadata("design:returntype", Promise)
], ReturnsController.prototype, "updateStatus", null);
exports.ReturnsController = ReturnsController = __decorate([
    (0, swagger_1.ApiTags)('returns'),
    (0, common_1.UseGuards)(verify_token_guard_1.VerifyTokenGuard, verify_disabled_user_guard_1.VerifyDisabledUserGuard, verify_admin_admin_guard_1.VerifyAdminAdminGuard),
    (0, common_1.Controller)('returns'),
    __metadata("design:paramtypes", [returns_service_1.ReturnsService])
], ReturnsController);
//# sourceMappingURL=returns.controller.js.map