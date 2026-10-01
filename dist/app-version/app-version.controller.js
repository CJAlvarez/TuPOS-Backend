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
exports.AppVersionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const skip_app_key_decorator_1 = require("../guards/skip-app-key.decorator");
const skip_version_floor_decorator_1 = require("../guards/skip-version-floor.decorator");
const app_version_service_1 = require("./app-version.service");
let AppVersionController = class AppVersionController {
    service;
    constructor(service) {
        this.service = service;
    }
    getVersionInfo() {
        return this.service.getVersionInfo();
    }
};
exports.AppVersionController = AppVersionController;
__decorate([
    (0, common_1.Get)(),
    (0, skip_app_key_decorator_1.SkipAppKey)(),
    (0, skip_version_floor_decorator_1.SkipVersionFloor)(),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, throttler_1.Throttle)({ default: { limit: 60, ttl: 60_000 } }),
    (0, swagger_1.ApiOperation)({
        summary: 'Versión del backend y política de actualización (endpoint público)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        schema: {
            example: {
                version: '26.2.1',
                min_version: '26.2.1',
                mandatory_update: false,
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AppVersionController.prototype, "getVersionInfo", null);
exports.AppVersionController = AppVersionController = __decorate([
    (0, swagger_1.ApiTags)('app-version'),
    (0, common_1.Controller)('app-version'),
    __metadata("design:paramtypes", [app_version_service_1.AppVersionService])
], AppVersionController);
//# sourceMappingURL=app-version.controller.js.map