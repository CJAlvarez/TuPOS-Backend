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
exports.InvoiceConfigController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const invoice_config_service_1 = require("./invoice-config.service");
const create_invoice_config_dto_1 = require("./dto/create-invoice-config.dto");
const update_invoice_config_dto_1 = require("./dto/update-invoice-config.dto");
const invoice_config_entity_1 = require("../entities/invoice-config.entity");
const verify_admin_admin_guard_1 = require("../auth/guards/verify-admin-admin.guard");
const verify_disabled_user_guard_1 = require("../auth/guards/verify-disabled-user.guard");
const verify_token_guard_1 = require("../auth/guards/verify-token.guard");
let InvoiceConfigController = class InvoiceConfigController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll(req) {
        return this.service.findAll(req.internal_store_id);
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    create(req, dto) {
        return this.service.create(req.internal_store_id, dto);
    }
    update(dto) {
        return this.service.update(dto);
    }
    remove(id) {
        return this.service.remove(id);
    }
};
exports.InvoiceConfigController = InvoiceConfigController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener la configuración de facturación (primer registro)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: invoice_config_entity_1.InvoiceConfig }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InvoiceConfigController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener configuración de facturación por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: invoice_config_entity_1.InvoiceConfig }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], InvoiceConfigController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear configuración de facturación' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: invoice_config_entity_1.InvoiceConfig }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_invoice_config_dto_1.CreateInvoiceConfigDto]),
    __metadata("design:returntype", void 0)
], InvoiceConfigController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar configuración de facturación' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: invoice_config_entity_1.InvoiceConfig }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_invoice_config_dto_1.UpdateInvoiceConfigDto]),
    __metadata("design:returntype", void 0)
], InvoiceConfigController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar configuración de facturación' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        schema: { example: { message: 'Configuración eliminada' } },
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], InvoiceConfigController.prototype, "remove", null);
exports.InvoiceConfigController = InvoiceConfigController = __decorate([
    (0, swagger_1.ApiTags)('invoice-config'),
    (0, common_1.Controller)('invoice-config'),
    (0, common_1.UseGuards)(verify_token_guard_1.VerifyTokenGuard, verify_disabled_user_guard_1.VerifyDisabledUserGuard, verify_admin_admin_guard_1.VerifyAdminAdminGuard),
    __metadata("design:paramtypes", [invoice_config_service_1.InvoiceConfigService])
], InvoiceConfigController);
//# sourceMappingURL=invoice-config.controller.js.map