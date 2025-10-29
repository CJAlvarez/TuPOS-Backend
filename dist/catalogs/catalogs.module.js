"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogsModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const catalog_version_entity_1 = require("../entities/catalog-version.entity");
const catalogs_service_1 = require("./catalogs.service");
const catalogs_controller_1 = require("./catalogs.controller");
const auth_module_1 = require("../auth/auth.module");
const admin_entity_1 = require("../entities/admin.entity");
let CatalogsModule = class CatalogsModule {
};
exports.CatalogsModule = CatalogsModule;
exports.CatalogsModule = CatalogsModule = __decorate([
    (0, common_1.Module)({
        imports: [sequelize_1.SequelizeModule.forFeature([catalog_version_entity_1.CatalogVersion, admin_entity_1.Admin]), auth_module_1.AuthModule],
        controllers: [catalogs_controller_1.CatalogsController],
        providers: [catalogs_service_1.CatalogsService],
    })
], CatalogsModule);
//# sourceMappingURL=catalogs.module.js.map