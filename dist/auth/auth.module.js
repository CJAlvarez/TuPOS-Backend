"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const jwt_strategy_1 = require("./jwt.strategy");
const config_1 = require("@nestjs/config");
const user_entity_1 = require("../entities/user.entity");
const profile_entity_1 = require("../entities/profile.entity");
const admin_entity_1 = require("../entities/admin.entity");
const client_entity_1 = require("../entities/client.entity");
const jobs_module_1 = require("../jobs/jobs.module");
const store_entity_1 = require("../entities/store.entity");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([user_entity_1.User, profile_entity_1.Profile, admin_entity_1.Admin, client_entity_1.Client, store_entity_1.Store]),
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('TOKEN_SECRET_KEY'),
                    signOptions: { expiresIn: '1d' },
                }),
                inject: [config_1.ConfigService],
            }),
            jobs_module_1.JobsModule,
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy],
        exports: [jwt_1.JwtModule],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map