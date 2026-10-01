"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AppVersionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppVersionService = void 0;
const common_1 = require("@nestjs/common");
const app_version_1 = require("../utils/app-version");
let AppVersionService = AppVersionService_1 = class AppVersionService {
    logger = new common_1.Logger(AppVersionService_1.name);
    version = (0, app_version_1.readOwnVersion)();
    getVersionInfo() {
        const configured = process.env.ADMIN_MIN_VERSION?.trim();
        const valid = !!configured && app_version_1.VERSION_PATTERN.test(configured);
        if (configured && !valid) {
            this.logger.warn(`ADMIN_MIN_VERSION="${configured}" no es una versión válida; se usa ${this.version}.`);
        }
        return {
            version: this.version,
            min_version: valid ? configured : this.version,
            mandatory_update: process.env.ADMIN_UPDATE_MANDATORY === 'true',
        };
    }
};
exports.AppVersionService = AppVersionService;
exports.AppVersionService = AppVersionService = AppVersionService_1 = __decorate([
    (0, common_1.Injectable)()
], AppVersionService);
//# sourceMappingURL=app-version.service.js.map