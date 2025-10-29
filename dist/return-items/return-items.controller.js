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
exports.ReturnItemsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const return_items_service_1 = require("./return-items.service");
const create_return_item_dto_1 = require("./dto/create-return-item.dto");
const update_return_item_dto_1 = require("./dto/update-return-item.dto");
const get_return_items_query_dto_1 = require("./dto/get-return-items-query.dto");
const update_return_item_status_dto_1 = require("./dto/update-return-item-status.dto");
const verify_token_guard_1 = require("../auth/guards/verify-token.guard");
const verify_disabled_user_guard_1 = require("../auth/guards/verify-disabled-user.guard");
const verify_admin_admin_guard_1 = require("../auth/guards/verify-admin-admin.guard");
let ReturnItemsController = class ReturnItemsController {
    returnItemsService;
    constructor(returnItemsService) {
        this.returnItemsService = returnItemsService;
    }
    async create(dto, req) {
        return this.returnItemsService.create(dto, req.internal_user_id);
    }
    async findAll(req, query) {
        return this.returnItemsService.findAll(query);
    }
    async findOne(id) {
        return this.returnItemsService.findOne(Number(id));
    }
    async update(dto, req) {
        return this.returnItemsService.update(dto, req.internal_user_id);
    }
    async remove(id, req) {
        return this.returnItemsService.remove(req.internal_user_id, Number(id));
    }
    async updateStatus(dto, req) {
        return this.returnItemsService.updateStatus(req.internal_user_id, dto);
    }
};
exports.ReturnItemsController = ReturnItemsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Crear item de devolución' }),
    (0, swagger_1.ApiBody)({ type: create_return_item_dto_1.CreateReturnItemDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Item de devolución creado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_return_item_dto_1.CreateReturnItemDto, Object]),
    __metadata("design:returntype", Promise)
], ReturnItemsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Listar items de devolución' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista paginada de items de devolución' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_return_items_query_dto_1.GetReturnItemsQueryDto]),
    __metadata("design:returntype", Promise)
], ReturnItemsController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obtener item de devolución por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item de devolución encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Item de devolución no encontrado' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReturnItemsController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar item de devolución' }),
    (0, swagger_1.ApiBody)({ type: update_return_item_dto_1.UpdateReturnItemDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item de devolución actualizado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Item de devolución no encontrado' }),
    (0, common_1.Put)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_return_item_dto_1.UpdateReturnItemDto, Object]),
    __metadata("design:returntype", Promise)
], ReturnItemsController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar item de devolución (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item de devolución eliminado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Item de devolución no encontrado' }),
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReturnItemsController.prototype, "remove", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Cambiar estado de item de devolución' }),
    (0, swagger_1.ApiBody)({ type: update_return_item_status_dto_1.UpdateReturnItemStatusDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estado actualizado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Item de devolución no encontrado' }),
    (0, common_1.Put)('status'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_return_item_status_dto_1.UpdateReturnItemStatusDto, Object]),
    __metadata("design:returntype", Promise)
], ReturnItemsController.prototype, "updateStatus", null);
exports.ReturnItemsController = ReturnItemsController = __decorate([
    (0, swagger_1.ApiTags)('return-items'),
    (0, common_1.UseGuards)(verify_token_guard_1.VerifyTokenGuard, verify_disabled_user_guard_1.VerifyDisabledUserGuard, verify_admin_admin_guard_1.VerifyAdminAdminGuard),
    (0, common_1.Controller)('return-items'),
    __metadata("design:paramtypes", [return_items_service_1.ReturnItemsService])
], ReturnItemsController);
//# sourceMappingURL=return-items.controller.js.map