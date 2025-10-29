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
exports.TerminalController = void 0;
const common_1 = require("@nestjs/common");
const create_terminal_dto_1 = require("./dto/create-terminal.dto");
const update_terminal_dto_1 = require("./dto/update-terminal.dto");
const get_terminals_query_dto_1 = require("./dto/get-terminals-query.dto");
const update_terminal_status_dto_1 = require("./dto/update-terminal-status.dto");
const swagger_1 = require("@nestjs/swagger");
const terminal_entity_1 = require("../entities/terminal.entity");
const terminal_service_1 = require("./terminal.service");
const verify_token_guard_1 = require("../auth/guards/verify-token.guard");
const verify_disabled_user_guard_1 = require("../auth/guards/verify-disabled-user.guard");
const verify_admin_admin_guard_1 = require("../auth/guards/verify-admin-admin.guard");
let TerminalController = class TerminalController {
    terminalService;
    constructor(terminalService) {
        this.terminalService = terminalService;
    }
    findAll(req, query) {
        return this.terminalService.findAll(query, req.internal_store_id);
    }
    findOne(id) {
        return this.terminalService.findOne(Number(id));
    }
    create(req, data) {
        return this.terminalService.create(req.internal_user_id, req.internal_store_id, data);
    }
    update(dto) {
        return this.terminalService.update(dto);
    }
    remove(req, id) {
        return this.terminalService.remove(req.internal_user_id, Number(id));
    }
    updateStatus(req, dto) {
        return this.terminalService.updateStatus(req.internal_user_id, dto);
    }
};
exports.TerminalController = TerminalController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los terminales (paginado y búsqueda)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de terminales paginada', type: Object }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_terminals_query_dto_1.GetTerminalsQueryDto]),
    __metadata("design:returntype", Promise)
], TerminalController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un terminal por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Terminal encontrado', type: terminal_entity_1.Terminal }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Terminal no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TerminalController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un terminal' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Terminal creado', type: terminal_entity_1.Terminal }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_terminal_dto_1.CreateTerminalDto]),
    __metadata("design:returntype", Promise)
], TerminalController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un terminal' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Terminal actualizado', type: terminal_entity_1.Terminal }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_terminal_dto_1.UpdateTerminalDto]),
    __metadata("design:returntype", Promise)
], TerminalController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un terminal (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Terminal eliminado' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TerminalController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)('status'),
    (0, swagger_1.ApiOperation)({ summary: 'Habilitar o deshabilitar terminal' }),
    (0, swagger_1.ApiBody)({ type: update_terminal_status_dto_1.UpdateTerminalStatusDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estado de terminal actualizado' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_terminal_status_dto_1.UpdateTerminalStatusDto]),
    __metadata("design:returntype", Promise)
], TerminalController.prototype, "updateStatus", null);
exports.TerminalController = TerminalController = __decorate([
    (0, swagger_1.ApiTags)('terminals'),
    (0, common_1.Controller)('terminals'),
    (0, common_1.UseGuards)(verify_token_guard_1.VerifyTokenGuard, verify_disabled_user_guard_1.VerifyDisabledUserGuard, verify_admin_admin_guard_1.VerifyAdminAdminGuard),
    __metadata("design:paramtypes", [terminal_service_1.TerminalService])
], TerminalController);
//# sourceMappingURL=terminal.controller.js.map