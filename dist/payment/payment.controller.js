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
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const create_payment_dto_1 = require("./dto/create-payment.dto");
const update_payment_dto_1 = require("./dto/update-payment.dto");
const get_payments_query_dto_1 = require("./dto/get-payments-query.dto");
const update_payment_status_dto_1 = require("./dto/update-payment-status.dto");
const swagger_1 = require("@nestjs/swagger");
const payment_entity_1 = require("../entities/payment.entity");
const payment_service_1 = require("./payment.service");
const verify_token_guard_1 = require("../auth/guards/verify-token.guard");
const verify_disabled_user_guard_1 = require("../auth/guards/verify-disabled-user.guard");
const verify_admin_admin_guard_1 = require("../auth/guards/verify-admin-admin.guard");
let PaymentController = class PaymentController {
    paymentService;
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    findAll(req, query) {
        return this.paymentService.findAll(query, req.internal_store_id);
    }
    findOne(id) {
        return this.paymentService.findOne(Number(id));
    }
    create(req, data) {
        return this.paymentService.create(req.internal_user_id, req.internal_store_id, data);
    }
    update(dto) {
        return this.paymentService.update(dto);
    }
    remove(req, id) {
        return this.paymentService.remove(req.internal_user_id, Number(id));
    }
    updateStatus(req, dto) {
        return this.paymentService.updateStatus(req.internal_user_id, dto);
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los pagos (paginado y búsqueda)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de pagos paginada', type: Object }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_payments_query_dto_1.GetPaymentsQueryDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un pago por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pago encontrado', type: payment_entity_1.Payment }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pago no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un pago' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Pago creado', type: payment_entity_1.Payment }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_payment_dto_1.CreatePaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un pago' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pago actualizado', type: payment_entity_1.Payment }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_payment_dto_1.UpdatePaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un pago (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pago eliminado' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)('status'),
    (0, swagger_1.ApiOperation)({ summary: 'Habilitar o deshabilitar pago' }),
    (0, swagger_1.ApiBody)({ type: update_payment_status_dto_1.UpdatePaymentStatusDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estado de pago actualizado' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_payment_status_dto_1.UpdatePaymentStatusDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "updateStatus", null);
exports.PaymentController = PaymentController = __decorate([
    (0, swagger_1.ApiTags)('payments'),
    (0, common_1.Controller)('payments'),
    (0, common_1.UseGuards)(verify_token_guard_1.VerifyTokenGuard, verify_disabled_user_guard_1.VerifyDisabledUserGuard, verify_admin_admin_guard_1.VerifyAdminAdminGuard),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map