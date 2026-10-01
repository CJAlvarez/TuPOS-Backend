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
var AppVersionFloorGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppVersionFloorGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const skip_version_floor_decorator_1 = require("./skip-version-floor.decorator");
const app_version_1 = require("../utils/app-version");
const HTTP_UPGRADE_REQUIRED = 426;
let AppVersionFloorGuard = AppVersionFloorGuard_1 = class AppVersionFloorGuard {
    reflector;
    logger = new common_1.Logger(AppVersionFloorGuard_1.name);
    ownVersion = (0, app_version_1.readOwnVersion)();
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        if (process.env.ADMIN_UPDATE_MANDATORY !== 'true') {
            return true;
        }
        const skip = this.reflector.getAllAndOverride(skip_version_floor_decorator_1.SKIP_VERSION_FLOOR, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (skip) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const clientVersion = request.headers['x-app-version'];
        if (!clientVersion) {
            return true;
        }
        const configured = process.env.ADMIN_MIN_VERSION?.trim();
        const floor = configured && app_version_1.VERSION_PATTERN.test(configured) ? configured : this.ownVersion;
        if (!(0, app_version_1.isBehind)(clientVersion, floor)) {
            return true;
        }
        this.logger.warn(`Cliente ${clientVersion} rechazado: por debajo del piso ${floor}.`);
        throw new common_1.HttpException({
            title: 'Actualización obligatoria',
            message: `Esta versión (${clientVersion}) ya no está permitida. Se necesita la ${floor}.`,
            status: HTTP_UPGRADE_REQUIRED,
            code: 'update-required',
            min_version: floor,
        }, HTTP_UPGRADE_REQUIRED);
    }
};
exports.AppVersionFloorGuard = AppVersionFloorGuard;
exports.AppVersionFloorGuard = AppVersionFloorGuard = AppVersionFloorGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], AppVersionFloorGuard);
//# sourceMappingURL=app-version-floor.guard.js.map