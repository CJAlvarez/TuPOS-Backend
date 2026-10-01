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
exports.AppKeyGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const skip_app_key_decorator_1 = require("./skip-app-key.decorator");
let AppKeyGuard = class AppKeyGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const skip = this.reflector.getAllAndOverride(skip_app_key_decorator_1.SKIP_APP_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (skip) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const appKey = request.headers['x-app-key'];
        const validAppKey = process.env.APP_KEY;
        if (!validAppKey) {
            return true;
        }
        if (!appKey || appKey !== validAppKey) {
            throw new common_1.NotFoundException();
        }
        return true;
    }
};
exports.AppKeyGuard = AppKeyGuard;
exports.AppKeyGuard = AppKeyGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], AppKeyGuard);
//# sourceMappingURL=app-key.guard.js.map