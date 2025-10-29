"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const path = require("path");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sequelize_1 = require("@nestjs/sequelize");
const core_1 = require("@nestjs/core");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const app_key_guard_1 = require("./guards/app-key.guard");
const user_entity_1 = require("./entities/user.entity");
const profile_entity_1 = require("./entities/profile.entity");
const auth_module_1 = require("./auth/auth.module");
const email_module_1 = require("./email/email.module");
const clients_module_1 = require("./clients/clients.module");
const catalogs_module_1 = require("./catalogs/catalogs.module");
const utils_module_1 = require("./utils/utils.module");
const account_module_1 = require("./account/account.module");
const invoice_config_module_1 = require("./invoice-config/invoice-config.module");
const invoices_module_1 = require("./invoices/invoices.module");
const users_module_1 = require("./users/users.module");
const products_module_1 = require("./products/products.module");
const client_entity_1 = require("./entities/client.entity");
const admin_entity_1 = require("./entities/admin.entity");
const jobs_module_1 = require("./jobs/jobs.module");
const reports_module_1 = require("./reports/reports.module");
const report_entity_1 = require("./entities/report.entity");
const schedule_1 = require("@nestjs/schedule");
const terminal_module_1 = require("./terminal/terminal.module");
const sale_module_1 = require("./sale/sale.module");
const sale_item_module_1 = require("./sale-item/sale-item.module");
const royalty_module_1 = require("./royalty/royalty.module");
const campaign_module_1 = require("./campaign/campaign.module");
const cashbox_module_1 = require("./cashbox/cashbox.module");
const discount_rule_module_1 = require("./discount-rule/discount-rule.module");
const gift_card_module_1 = require("./gift-card/gift-card.module");
const gift_card_transaction_module_1 = require("./gift-card-transaction/gift-card-transaction.module");
const payment_module_1 = require("./payment/payment.module");
const notification_module_1 = require("./notification/notification.module");
const inventory_module_1 = require("./inventory/inventory.module");
const returns_module_1 = require("./returns/returns.module");
const return_items_module_1 = require("./return-items/return-items.module");
const store_module_1 = require("./store/store.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: path.resolve(__dirname, '..', '.env'),
            }),
            sequelize_1.SequelizeModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    dialect: 'mysql',
                    host: configService.get('DB_HOST'),
                    port: +configService.get('DB_PORT', 3306),
                    username: configService.get('DB_USER'),
                    password: configService.get('DB_PASS'),
                    database: configService.get('DB_SCHEMA'),
                    autoLoadModels: true,
                    synchronize: true,
                    models: [user_entity_1.User, profile_entity_1.Profile, client_entity_1.Client, admin_entity_1.Admin, report_entity_1.Report],
                    timezone: '-06:00',
                    logging: configService.get('DB_LOGGING', false)
                        ? console.log
                        : false,
                }),
                inject: [config_1.ConfigService],
            }),
            sequelize_1.SequelizeModule.forFeature([
                user_entity_1.User,
                report_entity_1.Report,
            ]),
            email_module_1.EmailModule,
            schedule_1.ScheduleModule.forRoot(),
            auth_module_1.AuthModule,
            clients_module_1.ClientsModule,
            catalogs_module_1.CatalogsModule,
            utils_module_1.UtilsModule,
            account_module_1.AccountModule,
            invoice_config_module_1.InvoiceConfigModule,
            invoices_module_1.InvoicesModule,
            users_module_1.UsersModule,
            jobs_module_1.JobsModule,
            reports_module_1.ReportsModule,
            products_module_1.ProductsModule,
            inventory_module_1.InventoryModule,
            terminal_module_1.TerminalModule,
            sale_module_1.SaleModule,
            sale_item_module_1.SaleItemModule,
            royalty_module_1.RoyaltyModule,
            campaign_module_1.CampaignModule,
            cashbox_module_1.CashboxModule,
            discount_rule_module_1.DiscountRuleModule,
            gift_card_module_1.GiftCardModule,
            gift_card_transaction_module_1.GiftCardTransactionModule,
            payment_module_1.PaymentModule,
            notification_module_1.NotificationModule,
            returns_module_1.ReturnsModule,
            return_items_module_1.ReturnItemsModule,
            store_module_1.StoreModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: app_key_guard_1.AppKeyGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map