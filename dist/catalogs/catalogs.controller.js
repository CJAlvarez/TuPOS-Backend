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
exports.CatalogsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const catalogs_service_1 = require("./catalogs.service");
const verify_token_guard_1 = require("../auth/guards/verify-token.guard");
const verify_disabled_user_guard_1 = require("../auth/guards/verify-disabled-user.guard");
const verify_admin_admin_guard_1 = require("../auth/guards/verify-admin-admin.guard");
let CatalogsController = class CatalogsController {
    catalogsService;
    constructor(catalogsService) {
        this.catalogsService = catalogsService;
    }
    getCatalogs(query) {
        return this.catalogsService.getCatalogs(query);
    }
    getCatalogsVersion() {
        return this.catalogsService.getCatalogsVersion();
    }
    async updateCatalogVersion(key, date) {
        const versionDate = date ? new Date(date) : new Date();
        await this.catalogsService.updateCatalogVersion(key, versionDate);
        return { key, catalog_version: versionDate.toISOString() };
    }
    async getClients(search_word) {
        return this.catalogsService.getClients(search_word);
    }
};
exports.CatalogsController = CatalogsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener catálogos generales' }),
    (0, swagger_1.ApiQuery)({
        name: 'catalogs',
        required: true,
        type: (Array),
        description: 'Catálogos a consultar',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de catálogos' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CatalogsController.prototype, "getCatalogs", null);
__decorate([
    (0, common_1.Get)('version'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener versión actual de los catálogos' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Versión actual de los catálogos' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CatalogsController.prototype, "getCatalogsVersion", null);
__decorate([
    (0, common_1.Get)('update-version'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar la versión de un catálogo' }),
    (0, swagger_1.ApiQuery)({
        name: 'key',
        required: true,
        type: String,
        description: 'Nombre del catálogo',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'date',
        required: false,
        type: String,
        description: 'Fecha de la versión (ISO)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Versión actualizada' }),
    __param(0, (0, common_1.Query)('key')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CatalogsController.prototype, "updateCatalogVersion", null);
__decorate([
    (0, common_1.Get)('clients'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener clientes por search_word' }),
    (0, swagger_1.ApiQuery)({
        name: 'search_word',
        required: true,
        type: String,
        description: 'Palabra a buscar',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de clientes' }),
    (0, common_1.UseGuards)(verify_token_guard_1.VerifyTokenGuard, verify_disabled_user_guard_1.VerifyDisabledUserGuard, verify_admin_admin_guard_1.VerifyAdminAdminGuard),
    __param(0, (0, common_1.Query)('search_word')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CatalogsController.prototype, "getClients", null);
exports.CatalogsController = CatalogsController = __decorate([
    (0, swagger_1.ApiTags)('catalogs'),
    (0, common_1.Controller)('catalogs'),
    __metadata("design:paramtypes", [catalogs_service_1.CatalogsService])
], CatalogsController);
//# sourceMappingURL=catalogs.controller.js.map