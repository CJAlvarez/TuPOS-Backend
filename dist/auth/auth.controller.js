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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
const change_password_dto_1 = require("./dto/change-password.dto");
const recover_password_dto_1 = require("./dto/recover-password.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const first_login_dto_1 = require("./dto/first-login.dto");
const verify_disabled_user_guard_1 = require("./guards/verify-disabled-user.guard");
const verify_admin_admin_guard_1 = require("./guards/verify-admin-admin.guard");
const verify_token_guard_1 = require("./guards/verify-token.guard");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    login(loginDto) {
        return this.authService.login(loginDto);
    }
    getProfile(req) {
        return req.user;
    }
    async getUserData(req) {
        return this.authService.getUserData(req.internal_user_id);
    }
    changePassword(req, dto) {
        return this.authService.changePassword(req.user?.internal_user_id ?? req.internal_user_id, dto);
    }
    recoverPassword(dto) {
        return this.authService.recoverPassword(dto);
    }
    resetPassword(dto) {
        return this.authService.resetPassword(dto);
    }
    firstLogin(req, dto) {
        return this.authService.firstLogin(req.internal_user_id, dto);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('profile'),
    (0, common_1.UseGuards)(verify_token_guard_1.VerifyTokenGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('user-data'),
    (0, common_1.UseGuards)(verify_token_guard_1.VerifyTokenGuard, verify_disabled_user_guard_1.VerifyDisabledUserGuard, verify_admin_admin_guard_1.VerifyAdminAdminGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getUserData", null);
__decorate([
    (0, common_1.Post)('change-password'),
    (0, common_1.UseGuards)(verify_token_guard_1.VerifyTokenGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, change_password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Post)('recover-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [recover_password_dto_1.RecoverPasswordDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "recoverPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('first-login'),
    (0, common_1.UseGuards)(verify_token_guard_1.VerifyTokenGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, first_login_dto_1.FirstLoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "firstLogin", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map