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
exports.CampaignController = void 0;
const common_1 = require("@nestjs/common");
const create_campaign_dto_1 = require("./dto/create-campaign.dto");
const update_campaign_dto_1 = require("./dto/update-campaign.dto");
const get_campaigns_query_dto_1 = require("./dto/get-campaigns-query.dto");
const update_campaign_status_dto_1 = require("./dto/update-campaign-status.dto");
const swagger_1 = require("@nestjs/swagger");
const campaign_entity_1 = require("../entities/campaign.entity");
const campaign_service_1 = require("./campaign.service");
const verify_token_guard_1 = require("../auth/guards/verify-token.guard");
const verify_disabled_user_guard_1 = require("../auth/guards/verify-disabled-user.guard");
const verify_admin_admin_guard_1 = require("../auth/guards/verify-admin-admin.guard");
let CampaignController = class CampaignController {
    campaignService;
    constructor(campaignService) {
        this.campaignService = campaignService;
    }
    findAll(req, query) {
        return this.campaignService.findAll(query, req.internal_store_id);
    }
    findOne(id) {
        return this.campaignService.findOne(Number(id));
    }
    create(req, data) {
        return this.campaignService.create(req.internal_user_id, req.internal_store_id, data);
    }
    update(dto) {
        return this.campaignService.update(dto);
    }
    remove(req, id) {
        return this.campaignService.remove(req.internal_user_id, Number(id));
    }
    updateStatus(req, dto) {
        return this.campaignService.updateStatus(req.internal_user_id, dto);
    }
};
exports.CampaignController = CampaignController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las campañas (paginado y búsqueda)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de campañas paginada', type: Object }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_campaigns_query_dto_1.GetCampaignsQueryDto]),
    __metadata("design:returntype", Promise)
], CampaignController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una campaña por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Campaña encontrada', type: campaign_entity_1.Campaign }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Campaña no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CampaignController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una campaña' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Campaña creada', type: campaign_entity_1.Campaign }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_campaign_dto_1.CreateCampaignDto]),
    __metadata("design:returntype", Promise)
], CampaignController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar una campaña' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Campaña actualizada', type: campaign_entity_1.Campaign }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_campaign_dto_1.UpdateCampaignDto]),
    __metadata("design:returntype", Promise)
], CampaignController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una campaña (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Campaña eliminada' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CampaignController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)('status'),
    (0, swagger_1.ApiOperation)({ summary: 'Habilitar o deshabilitar campaña' }),
    (0, swagger_1.ApiBody)({ type: update_campaign_status_dto_1.UpdateCampaignStatusDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estado de campaña actualizado' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_campaign_status_dto_1.UpdateCampaignStatusDto]),
    __metadata("design:returntype", Promise)
], CampaignController.prototype, "updateStatus", null);
exports.CampaignController = CampaignController = __decorate([
    (0, swagger_1.ApiTags)('campaigns'),
    (0, common_1.Controller)('campaigns'),
    (0, common_1.UseGuards)(verify_token_guard_1.VerifyTokenGuard, verify_disabled_user_guard_1.VerifyDisabledUserGuard, verify_admin_admin_guard_1.VerifyAdminAdminGuard),
    __metadata("design:paramtypes", [campaign_service_1.CampaignService])
], CampaignController);
//# sourceMappingURL=campaign.controller.js.map