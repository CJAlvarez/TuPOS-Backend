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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const enable_user_dto_1 = require("./dto/enable-user.dto");
const update_user_status_dto_1 = require("./dto/update-user-status.dto");
const delete_user_dto_1 = require("./dto/delete-user.dto");
const get_users_query_dto_1 = require("./dto/get-users-query.dto");
const user_entity_1 = require("../entities/user.entity");
const verify_admin_admin_guard_1 = require("../auth/guards/verify-admin-admin.guard");
const verify_disabled_user_guard_1 = require("../auth/guards/verify-disabled-user.guard");
const verify_token_guard_1 = require("../auth/guards/verify-token.guard");
let UsersController = class UsersController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll(req, query) {
        return this.service.findAll(query);
    }
    create(req, dto) {
        return this.service.create(req.internal_user_id, dto);
    }
    update(req, dto) {
        return this.service.update(req.internal_user_id, dto);
    }
    remove(req, dto) {
        return this.service.remove(req.internal_user_id, dto);
    }
    setUserStatus(req, body) {
        return this.service.setUserStatus(req.internal_user_id, body);
    }
    setEnableUser(req, body) {
        return this.service.setEnableUser(req.internal_user_id, body);
    }
    recoverPassword(body) {
        return this.service.recoverUserPassword(body.id_user, {
            password: body.password,
            secret: body.secret,
        });
    }
    getUserAccesses(id_user) {
        return this.service.getUserAccesses(Number(id_user));
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener lista de administradores' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        schema: { example: { count: 100, list: [], skip: 0 } },
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_users_query_dto_1.GetUsersQueryDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear administrador' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: user_entity_1.User }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar administrador' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: user_entity_1.User }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar administrador' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        schema: { example: { message: 'Administrador eliminado' } },
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, delete_user_dto_1.DeleteUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)('status'),
    (0, swagger_1.ApiOperation)({ summary: 'Habilitar/deshabilitar administrador' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        schema: { example: { message: 'El administrador ha sido Habilitado.' } },
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_status_dto_1.UpdateUserStatusDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "setUserStatus", null);
__decorate([
    (0, common_1.Put)('enable'),
    (0, swagger_1.ApiOperation)({ summary: 'Habilitar/deshabilitar administrador (legacy)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        schema: { example: { message: 'Usuario habilitado' } },
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, enable_user_dto_1.EnableUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "setEnableUser", null);
__decorate([
    (0, common_1.Put)('recover-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Recuperar/restaurar contraseña' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        schema: { example: { message: 'Contraseña restaurada' } },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "recoverPassword", null);
__decorate([
    (0, common_1.Get)(':id_user/accesses'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener accesos del usuario' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        schema: { example: { admin: true } },
    }),
    __param(0, (0, common_1.Param)('id_user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getUserAccesses", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(verify_token_guard_1.VerifyTokenGuard, verify_disabled_user_guard_1.VerifyDisabledUserGuard, verify_admin_admin_guard_1.VerifyAdminAdminGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map