"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceConfigModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const invoice_config_entity_1 = require("../entities/invoice-config.entity");
const admin_entity_1 = require("../entities/admin.entity");
const invoice_config_controller_1 = require("./invoice-config.controller");
const invoice_config_service_1 = require("./invoice-config.service");
const auth_module_1 = require("../auth/auth.module");
let InvoiceConfigModule = class InvoiceConfigModule {
};
exports.InvoiceConfigModule = InvoiceConfigModule;
exports.InvoiceConfigModule = InvoiceConfigModule = __decorate([
    (0, common_1.Module)({
        imports: [sequelize_1.SequelizeModule.forFeature([invoice_config_entity_1.InvoiceConfig, admin_entity_1.Admin]), auth_module_1.AuthModule],
        controllers: [invoice_config_controller_1.InvoiceConfigController],
        providers: [invoice_config_service_1.InvoiceConfigService],
    })
], InvoiceConfigModule);
//# sourceMappingURL=invoice-config.module.js.map