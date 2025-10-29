"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountRuleModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const discount_rule_entity_1 = require("../entities/discount-rule.entity");
const discount_rule_service_1 = require("./discount-rule.service");
const discount_rule_controller_1 = require("./discount-rule.controller");
const admin_entity_1 = require("../entities/admin.entity");
const auth_module_1 = require("../auth/auth.module");
const jobs_module_1 = require("../jobs/jobs.module");
const utils_module_1 = require("../utils/utils.module");
let DiscountRuleModule = class DiscountRuleModule {
};
exports.DiscountRuleModule = DiscountRuleModule;
exports.DiscountRuleModule = DiscountRuleModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([discount_rule_entity_1.DiscountRule, admin_entity_1.Admin]),
            auth_module_1.AuthModule,
            jobs_module_1.JobsModule,
            utils_module_1.UtilsModule,
        ],
        controllers: [discount_rule_controller_1.DiscountRuleController],
        providers: [discount_rule_service_1.DiscountRuleService],
        exports: [discount_rule_service_1.DiscountRuleService],
    })
], DiscountRuleModule);
//# sourceMappingURL=discount-rule.module.js.map