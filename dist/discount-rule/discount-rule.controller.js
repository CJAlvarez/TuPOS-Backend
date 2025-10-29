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
exports.DiscountRuleController = void 0;
const common_1 = require("@nestjs/common");
const create_discount_rule_dto_1 = require("./dto/create-discount-rule.dto");
const update_discount_rule_dto_1 = require("./dto/update-discount-rule.dto");
const get_discount_rules_query_dto_1 = require("./dto/get-discount-rules-query.dto");
const update_discount_rule_status_dto_1 = require("./dto/update-discount-rule-status.dto");
const swagger_1 = require("@nestjs/swagger");
const discount_rule_entity_1 = require("../entities/discount-rule.entity");
const discount_rule_service_1 = require("./discount-rule.service");
const verify_token_guard_1 = require("../auth/guards/verify-token.guard");
const verify_disabled_user_guard_1 = require("../auth/guards/verify-disabled-user.guard");
const verify_admin_admin_guard_1 = require("../auth/guards/verify-admin-admin.guard");
let DiscountRuleController = class DiscountRuleController {
    discountRuleService;
    constructor(discountRuleService) {
        this.discountRuleService = discountRuleService;
    }
    findAll(req, query) {
        return this.discountRuleService.findAll(query, req.internal_store_id);
    }
    findOne(id) {
        return this.discountRuleService.findOne(Number(id));
    }
    create(req, data) {
        return this.discountRuleService.create(req.internal_user_id, req.internal_store_id, data);
    }
    update(dto) {
        return this.discountRuleService.update(dto);
    }
    remove(req, id) {
        return this.discountRuleService.remove(req.internal_user_id, Number(id));
    }
    updateStatus(req, dto) {
        return this.discountRuleService.updateStatus(req.internal_user_id, dto);
    }
};
exports.DiscountRuleController = DiscountRuleController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las reglas de descuento (paginado y búsqueda)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de reglas de descuento paginada', type: Object }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_discount_rules_query_dto_1.GetDiscountRulesQueryDto]),
    __metadata("design:returntype", Promise)
], DiscountRuleController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una regla de descuento por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Regla de descuento encontrada', type: discount_rule_entity_1.DiscountRule }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Regla de descuento no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DiscountRuleController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una regla de descuento' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Regla de descuento creada', type: discount_rule_entity_1.DiscountRule }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_discount_rule_dto_1.CreateDiscountRuleDto]),
    __metadata("design:returntype", Promise)
], DiscountRuleController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar una regla de descuento' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Regla de descuento actualizada', type: discount_rule_entity_1.DiscountRule }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_discount_rule_dto_1.UpdateDiscountRuleDto]),
    __metadata("design:returntype", Promise)
], DiscountRuleController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una regla de descuento (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Regla de descuento eliminada' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DiscountRuleController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)('status'),
    (0, swagger_1.ApiOperation)({ summary: 'Habilitar o deshabilitar regla de descuento' }),
    (0, swagger_1.ApiBody)({ type: update_discount_rule_status_dto_1.UpdateDiscountRuleStatusDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estado de regla de descuento actualizado' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_discount_rule_status_dto_1.UpdateDiscountRuleStatusDto]),
    __metadata("design:returntype", Promise)
], DiscountRuleController.prototype, "updateStatus", null);
exports.DiscountRuleController = DiscountRuleController = __decorate([
    (0, swagger_1.ApiTags)('discount-rules'),
    (0, common_1.Controller)('discount-rules'),
    (0, common_1.UseGuards)(verify_token_guard_1.VerifyTokenGuard, verify_disabled_user_guard_1.VerifyDisabledUserGuard, verify_admin_admin_guard_1.VerifyAdminAdminGuard),
    __metadata("design:paramtypes", [discount_rule_service_1.DiscountRuleService])
], DiscountRuleController);
//# sourceMappingURL=discount-rule.controller.js.map