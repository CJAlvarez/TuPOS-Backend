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
exports.GiftCardTransactionController = void 0;
const common_1 = require("@nestjs/common");
const create_gift_card_transaction_dto_1 = require("./dto/create-gift-card-transaction.dto");
const update_gift_card_transaction_dto_1 = require("./dto/update-gift-card-transaction.dto");
const get_gift_card_transactions_query_dto_1 = require("./dto/get-gift-card-transactions-query.dto");
const update_gift_card_transaction_status_dto_1 = require("./dto/update-gift-card-transaction-status.dto");
const swagger_1 = require("@nestjs/swagger");
const gift_card_transaction_entity_1 = require("../entities/gift-card-transaction.entity");
const gift_card_transaction_service_1 = require("./gift-card-transaction.service");
const verify_token_guard_1 = require("../auth/guards/verify-token.guard");
const verify_disabled_user_guard_1 = require("../auth/guards/verify-disabled-user.guard");
const verify_admin_admin_guard_1 = require("../auth/guards/verify-admin-admin.guard");
let GiftCardTransactionController = class GiftCardTransactionController {
    giftCardTransactionService;
    constructor(giftCardTransactionService) {
        this.giftCardTransactionService = giftCardTransactionService;
    }
    findAll(req, query) {
        return this.giftCardTransactionService.findAll(query, req.internal_store_id);
    }
    findOne(id) {
        return this.giftCardTransactionService.findOne(Number(id));
    }
    create(req, data) {
        return this.giftCardTransactionService.create(req.internal_user_id, req.internal_store_id, data);
    }
    update(dto) {
        return this.giftCardTransactionService.update(dto);
    }
    remove(req, id) {
        return this.giftCardTransactionService.remove(req.internal_user_id, Number(id));
    }
    updateStatus(req, dto) {
        return this.giftCardTransactionService.updateStatus(req.internal_user_id, dto);
    }
};
exports.GiftCardTransactionController = GiftCardTransactionController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las transacciones de gift card (paginado y búsqueda)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de transacciones paginada', type: Object }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_gift_card_transactions_query_dto_1.GetGiftCardTransactionsQueryDto]),
    __metadata("design:returntype", Promise)
], GiftCardTransactionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una transacción de gift card por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Transacción encontrada', type: gift_card_transaction_entity_1.GiftCardTransaction }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Transacción no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GiftCardTransactionController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una transacción de gift card' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Transacción creada', type: gift_card_transaction_entity_1.GiftCardTransaction }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_gift_card_transaction_dto_1.CreateGiftCardTransactionDto]),
    __metadata("design:returntype", Promise)
], GiftCardTransactionController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar una transacción de gift card' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Transacción actualizada', type: gift_card_transaction_entity_1.GiftCardTransaction }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_gift_card_transaction_dto_1.UpdateGiftCardTransactionDto]),
    __metadata("design:returntype", Promise)
], GiftCardTransactionController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una transacción de gift card (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Transacción eliminada' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], GiftCardTransactionController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)('status'),
    (0, swagger_1.ApiOperation)({ summary: 'Habilitar o deshabilitar transacción de gift card' }),
    (0, swagger_1.ApiBody)({ type: update_gift_card_transaction_status_dto_1.UpdateGiftCardTransactionStatusDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estado de transacción actualizado' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_gift_card_transaction_status_dto_1.UpdateGiftCardTransactionStatusDto]),
    __metadata("design:returntype", Promise)
], GiftCardTransactionController.prototype, "updateStatus", null);
exports.GiftCardTransactionController = GiftCardTransactionController = __decorate([
    (0, swagger_1.ApiTags)('gift-card-transactions'),
    (0, common_1.Controller)('gift-card-transactions'),
    (0, common_1.UseGuards)(verify_token_guard_1.VerifyTokenGuard, verify_disabled_user_guard_1.VerifyDisabledUserGuard, verify_admin_admin_guard_1.VerifyAdminAdminGuard),
    __metadata("design:paramtypes", [gift_card_transaction_service_1.GiftCardTransactionService])
], GiftCardTransactionController);
//# sourceMappingURL=gift-card-transaction.controller.js.map