"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoyaltyModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const royalty_entity_1 = require("../entities/royalty.entity");
const royalty_service_1 = require("./royalty.service");
const royalty_controller_1 = require("./royalty.controller");
const admin_entity_1 = require("../entities/admin.entity");
const auth_module_1 = require("../auth/auth.module");
const jobs_module_1 = require("../jobs/jobs.module");
const utils_module_1 = require("../utils/utils.module");
let RoyaltyModule = class RoyaltyModule {
};
exports.RoyaltyModule = RoyaltyModule;
exports.RoyaltyModule = RoyaltyModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([royalty_entity_1.Royalty, admin_entity_1.Admin]),
            auth_module_1.AuthModule,
            jobs_module_1.JobsModule,
            utils_module_1.UtilsModule,
        ],
        controllers: [royalty_controller_1.RoyaltyController],
        providers: [royalty_service_1.RoyaltyService],
        exports: [royalty_service_1.RoyaltyService],
    })
], RoyaltyModule);
//# sourceMappingURL=royalty.module.js.map