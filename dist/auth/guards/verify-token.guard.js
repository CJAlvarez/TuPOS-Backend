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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyTokenGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let VerifyTokenGuard = class VerifyTokenGuard {
    jwtService;
    configService;
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        if (this.configService.get('SKIP_VERIFY') &&
            this.configService.get('INTERNAL_USER_ID')) {
            request.internal_user_id = this.configService.get('INTERNAL_USER_ID');
            return true;
        }
        const { authorization } = request.headers;
        if (!authorization) {
            throw new common_1.UnauthorizedException({
                auth: false,
                title: 'Acceso No Autorizado',
                message: 'Intento acceder a un recurso prohibido',
                code: 'auth',
                status: 401,
            });
        }
        const token = authorization.replace('Bearer ', '');
        if (!token) {
            throw new common_1.UnauthorizedException({
                auth: false,
                title: 'Acceso No Autorizado',
                message: 'Intento acceder a un recurso prohibido',
                code: 'auth',
                status: 401,
            });
        }
        try {
            const decoded = this.jwtService.verify(token, {
                secret: this.configService.get('TOKEN_SECRET_KEY'),
            });
            request.internal_user_id = decoded.id_user;
            return true;
        }
        catch (err) {
            throw new common_1.UnauthorizedException({
                auth: false,
                title: 'Acceso No Autorizado',
                message: 'Intento acceder a un recurso prohibido',
                code: 'auth',
                status: 401,
            });
        }
    }
};
exports.VerifyTokenGuard = VerifyTokenGuard;
exports.VerifyTokenGuard = VerifyTokenGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], VerifyTokenGuard);
//# sourceMappingURL=verify-token.guard.js.map