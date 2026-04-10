"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sale_entity_1 = require("../entities/sale.entity");
const sale_service_1 = require("./sale.service");
const sale_controller_1 = require("./sale.controller");
const admin_entity_1 = require("../entities/admin.entity");
const auth_module_1 = require("../auth/auth.module");
const jobs_module_1 = require("../jobs/jobs.module");
const utils_module_1 = require("../utils/utils.module");
const royalty_module_1 = require("../royalty/royalty.module");
const gift_card_module_1 = require("../gift-card/gift-card.module");
const inventory_module_1 = require("../inventory/inventory.module");
const payment_module_1 = require("../payment/payment.module");
const sale_item_module_1 = require("../sale-item/sale-item.module");
let SaleModule = class SaleModule {
};
exports.SaleModule = SaleModule;
exports.SaleModule = SaleModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([sale_entity_1.Sale, admin_entity_1.Admin]),
            auth_module_1.AuthModule,
            jobs_module_1.JobsModule,
            utils_module_1.UtilsModule,
            royalty_module_1.RoyaltyModule,
            gift_card_module_1.GiftCardModule,
            inventory_module_1.InventoryModule,
            payment_module_1.PaymentModule,
            sale_item_module_1.SaleItemModule,
        ],
        controllers: [sale_controller_1.SaleController],
        providers: [sale_service_1.SaleService],
        exports: [sale_service_1.SaleService],
    })
], SaleModule);
//# sourceMappingURL=sale.module.js.map