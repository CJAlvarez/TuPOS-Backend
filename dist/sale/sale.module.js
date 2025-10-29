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
const sale_item_entity_1 = require("../entities/sale-item.entity");
const product_entity_1 = require("../entities/product.entity");
const inventory_entity_1 = require("../entities/inventory.entity");
const payment_entity_1 = require("../entities/payment.entity");
const gift_card_entity_1 = require("../entities/gift-card.entity");
const gift_card_transaction_entity_1 = require("../entities/gift-card-transaction.entity");
const sale_service_1 = require("./sale.service");
const sale_controller_1 = require("./sale.controller");
const admin_entity_1 = require("../entities/admin.entity");
const auth_module_1 = require("../auth/auth.module");
const jobs_module_1 = require("../jobs/jobs.module");
const utils_module_1 = require("../utils/utils.module");
let SaleModule = class SaleModule {
};
exports.SaleModule = SaleModule;
exports.SaleModule = SaleModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([
                sale_entity_1.Sale,
                sale_item_entity_1.SaleItem,
                product_entity_1.Product,
                inventory_entity_1.Inventory,
                payment_entity_1.Payment,
                gift_card_entity_1.GiftCard,
                gift_card_transaction_entity_1.GiftCardTransaction,
                admin_entity_1.Admin,
            ]),
            auth_module_1.AuthModule,
            jobs_module_1.JobsModule,
            utils_module_1.UtilsModule,
        ],
        controllers: [sale_controller_1.SaleController],
        providers: [sale_service_1.SaleService],
        exports: [sale_service_1.SaleService],
    })
], SaleModule);
//# sourceMappingURL=sale.module.js.map