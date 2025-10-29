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
exports.CashboxController = void 0;
const common_1 = require("@nestjs/common");
const create_cashbox_dto_1 = require("./dto/create-cashbox.dto");
const update_cashbox_dto_1 = require("./dto/update-cashbox.dto");
const get_cashboxes_query_dto_1 = require("./dto/get-cashboxes-query.dto");
const update_cashbox_status_dto_1 = require("./dto/update-cashbox-status.dto");
const swagger_1 = require("@nestjs/swagger");
const open_cashbox_dto_1 = require("./dto/open-cashbox.dto");
const close_cashbox_dto_1 = require("./dto/close-cashbox.dto");
const cashbox_entity_1 = require("../entities/cashbox.entity");
const cashbox_service_1 = require("./cashbox.service");
const verify_token_guard_1 = require("../auth/guards/verify-token.guard");
const verify_disabled_user_guard_1 = require("../auth/guards/verify-disabled-user.guard");
const verify_admin_admin_guard_1 = require("../auth/guards/verify-admin-admin.guard");
let CashboxController = class CashboxController {
    cashboxService;
    constructor(cashboxService) {
        this.cashboxService = cashboxService;
    }
    findAll(req, query) {
        return this.cashboxService.findAll(query, req.internal_store_id);
    }
    findOne(id) {
        return this.cashboxService.findOne(Number(id));
    }
    create(req, data) {
        return this.cashboxService.create(req.internal_user_id, req.internal_store_id, data);
    }
    update(dto) {
        return this.cashboxService.update(dto);
    }
    remove(req, id) {
        return this.cashboxService.remove(req.internal_user_id, Number(id));
    }
    updateStatus(req, dto) {
        return this.cashboxService.updateStatus(req.internal_user_id, dto);
    }
    openCashbox(req, dto) {
        return this.cashboxService.openCashbox(req.internal_user_id, dto);
    }
    closeCashbox(req, dto) {
        return this.cashboxService.closeCashbox(req.internal_user_id, dto);
    }
};
exports.CashboxController = CashboxController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las cajas (paginado y búsqueda)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de cajas paginada', type: Object }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_cashboxes_query_dto_1.GetCashboxesQueryDto]),
    __metadata("design:returntype", Promise)
], CashboxController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una caja por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Caja encontrada', type: cashbox_entity_1.Cashbox }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Caja no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CashboxController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una caja' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Caja creada', type: cashbox_entity_1.Cashbox }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_cashbox_dto_1.CreateCashboxDto]),
    __metadata("design:returntype", Promise)
], CashboxController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar una caja' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Caja actualizada', type: cashbox_entity_1.Cashbox }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_cashbox_dto_1.UpdateCashboxDto]),
    __metadata("design:returntype", Promise)
], CashboxController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una caja (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Caja eliminada' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CashboxController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)('status'),
    (0, swagger_1.ApiOperation)({ summary: 'Habilitar o deshabilitar caja' }),
    (0, swagger_1.ApiBody)({ type: update_cashbox_status_dto_1.UpdateCashboxStatusDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estado de caja actualizado' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_cashbox_status_dto_1.UpdateCashboxStatusDto]),
    __metadata("design:returntype", Promise)
], CashboxController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Put)('open'),
    (0, swagger_1.ApiOperation)({ summary: 'Abrir caja' }),
    (0, swagger_1.ApiBody)({ type: open_cashbox_dto_1.OpenCashboxDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Caja abierta' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, open_cashbox_dto_1.OpenCashboxDto]),
    __metadata("design:returntype", Promise)
], CashboxController.prototype, "openCashbox", null);
__decorate([
    (0, common_1.Put)('close'),
    (0, swagger_1.ApiOperation)({ summary: 'Cerrar caja' }),
    (0, swagger_1.ApiBody)({ type: close_cashbox_dto_1.CloseCashboxDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Caja cerrada' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, close_cashbox_dto_1.CloseCashboxDto]),
    __metadata("design:returntype", Promise)
], CashboxController.prototype, "closeCashbox", null);
exports.CashboxController = CashboxController = __decorate([
    (0, swagger_1.ApiTags)('cashboxes'),
    (0, common_1.Controller)('cashboxes'),
    (0, common_1.UseGuards)(verify_token_guard_1.VerifyTokenGuard, verify_disabled_user_guard_1.VerifyDisabledUserGuard, verify_admin_admin_guard_1.VerifyAdminAdminGuard),
    __metadata("design:paramtypes", [cashbox_service_1.CashboxService])
], CashboxController);
//# sourceMappingURL=cashbox.controller.js.map