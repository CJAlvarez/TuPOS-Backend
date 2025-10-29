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
exports.ClientsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const clients_service_1 = require("./clients.service");
const create_client_dto_1 = require("./dto/create-client.dto");
const get_clients_query_dto_1 = require("./dto/get-clients-query.dto");
const update_client_dto_1 = require("./dto/update-client.dto");
const update_client_status_dto_1 = require("./dto/update-client-status.dto");
const verify_admin_admin_guard_1 = require("../auth/guards/verify-admin-admin.guard");
const verify_disabled_user_guard_1 = require("../auth/guards/verify-disabled-user.guard");
const verify_token_guard_1 = require("../auth/guards/verify-token.guard");
let ClientsController = class ClientsController {
    clientsService;
    constructor(clientsService) {
        this.clientsService = clientsService;
    }
    async getClients(req, query) {
        return this.clientsService.getClients(query, req.internal_store_id);
    }
    async getClientDetail(id) {
        return this.clientsService.getClientDetail(id);
    }
    async insertClient(req, createClientDto) {
        return this.clientsService.insertClient(createClientDto, req.internal_store_id, req.internal_user_id);
    }
    async updateClient(updateClientDto) {
        return this.clientsService.updateClient(updateClientDto);
    }
    async updateClientStatus(req, body) {
        return this.clientsService.updateClientStatus(req.internal_user_id, body);
    }
};
exports.ClientsController = ClientsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener lista de clientes' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'skip', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de clientes' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_clients_query_dto_1.GetClientsQueryDto]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "getClients", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener detalle de cliente' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Detalle de cliente' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "getClientDetail", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear cliente' }),
    (0, swagger_1.ApiBody)({ type: create_client_dto_1.CreateClientDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Cliente creado' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_client_dto_1.CreateClientDto]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "insertClient", null);
__decorate([
    (0, common_1.Put)(),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar cliente' }),
    (0, swagger_1.ApiBody)({ type: update_client_dto_1.UpdateClientDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cliente actualizado' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_client_dto_1.UpdateClientDto]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "updateClient", null);
__decorate([
    (0, common_1.Put)('status'),
    (0, swagger_1.ApiOperation)({ summary: 'Habilitar o deshabilitar cliente' }),
    (0, swagger_1.ApiBody)({ type: update_client_status_dto_1.UpdateClientStatusDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estado de cliente actualizado' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_client_status_dto_1.UpdateClientStatusDto]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "updateClientStatus", null);
exports.ClientsController = ClientsController = __decorate([
    (0, swagger_1.ApiTags)('clients'),
    (0, common_1.Controller)('clients'),
    (0, common_1.UseGuards)(verify_token_guard_1.VerifyTokenGuard, verify_disabled_user_guard_1.VerifyDisabledUserGuard, verify_admin_admin_guard_1.VerifyAdminAdminGuard),
    __metadata("design:paramtypes", [clients_service_1.ClientsService])
], ClientsController);
//# sourceMappingURL=clients.controller.js.map