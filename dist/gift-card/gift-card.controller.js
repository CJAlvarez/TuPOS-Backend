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
exports.GiftCardController = void 0;
const common_1 = require("@nestjs/common");
const create_gift_card_dto_1 = require("./dto/create-gift-card.dto");
const update_gift_card_dto_1 = require("./dto/update-gift-card.dto");
const get_gift_cards_query_dto_1 = require("./dto/get-gift-cards-query.dto");
const update_gift_card_status_dto_1 = require("./dto/update-gift-card-status.dto");
const swagger_1 = require("@nestjs/swagger");
const gift_card_entity_1 = require("../entities/gift-card.entity");
const gift_card_service_1 = require("./gift-card.service");
const verify_token_guard_1 = require("../auth/guards/verify-token.guard");
const verify_disabled_user_guard_1 = require("../auth/guards/verify-disabled-user.guard");
const verify_admin_admin_guard_1 = require("../auth/guards/verify-admin-admin.guard");
let GiftCardController = class GiftCardController {
    giftCardService;
    constructor(giftCardService) {
        this.giftCardService = giftCardService;
    }
    findAll(req, query) {
        return this.giftCardService.findAll(query, req.internal_store_id);
    }
    findOne(id) {
        return this.giftCardService.findOne(Number(id));
    }
    create(req, data) {
        return this.giftCardService.create(req.internal_user_id, req.internal_store_id, data);
    }
    update(dto) {
        return this.giftCardService.update(dto);
    }
    remove(req, id) {
        return this.giftCardService.remove(req.internal_user_id, Number(id));
    }
    updateStatus(req, dto) {
        return this.giftCardService.updateStatus(req.internal_user_id, dto);
    }
};
exports.GiftCardController = GiftCardController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las gift cards (paginado y búsqueda)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de gift cards paginada', type: Object }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_gift_cards_query_dto_1.GetGiftCardsQueryDto]),
    __metadata("design:returntype", Promise)
], GiftCardController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una gift card por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Gift card encontrada', type: gift_card_entity_1.GiftCard }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Gift card no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GiftCardController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una gift card' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Gift card creada', type: gift_card_entity_1.GiftCard }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_gift_card_dto_1.CreateGiftCardDto]),
    __metadata("design:returntype", Promise)
], GiftCardController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar una gift card' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Gift card actualizada', type: gift_card_entity_1.GiftCard }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_gift_card_dto_1.UpdateGiftCardDto]),
    __metadata("design:returntype", Promise)
], GiftCardController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una gift card (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Gift card eliminada' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], GiftCardController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)('status'),
    (0, swagger_1.ApiOperation)({ summary: 'Habilitar o deshabilitar gift card' }),
    (0, swagger_1.ApiBody)({ type: update_gift_card_status_dto_1.UpdateGiftCardStatusDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estado de gift card actualizado' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_gift_card_status_dto_1.UpdateGiftCardStatusDto]),
    __metadata("design:returntype", Promise)
], GiftCardController.prototype, "updateStatus", null);
exports.GiftCardController = GiftCardController = __decorate([
    (0, swagger_1.ApiTags)('gift-cards'),
    (0, common_1.Controller)('gift-cards'),
    (0, common_1.UseGuards)(verify_token_guard_1.VerifyTokenGuard, verify_disabled_user_guard_1.VerifyDisabledUserGuard, verify_admin_admin_guard_1.VerifyAdminAdminGuard),
    __metadata("design:paramtypes", [gift_card_service_1.GiftCardService])
], GiftCardController);
//# sourceMappingURL=gift-card.controller.js.map