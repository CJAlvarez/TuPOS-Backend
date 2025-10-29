"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientsModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const clients_service_1 = require("./clients.service");
const clients_controller_1 = require("./clients.controller");
const client_entity_1 = require("../entities/client.entity");
const user_entity_1 = require("../entities/user.entity");
const profile_entity_1 = require("../entities/profile.entity");
const admin_entity_1 = require("../entities/admin.entity");
const auth_module_1 = require("../auth/auth.module");
const utils_module_1 = require("../utils/utils.module");
const jobs_module_1 = require("../jobs/jobs.module");
let ClientsModule = class ClientsModule {
};
exports.ClientsModule = ClientsModule;
exports.ClientsModule = ClientsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([client_entity_1.Client, user_entity_1.User, profile_entity_1.Profile, admin_entity_1.Admin]),
            utils_module_1.UtilsModule,
            auth_module_1.AuthModule,
            jobs_module_1.JobsModule
        ],
        controllers: [clients_controller_1.ClientsController],
        providers: [clients_service_1.ClientsService],
        exports: [clients_service_1.ClientsService],
    })
], ClientsModule);
//# sourceMappingURL=clients.module.js.map