import * as path from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { APP_GUARD } from '@nestjs/core';
import { Dialect } from 'sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppKeyGuard } from './guards/app-key.guard';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { ClientsModule } from './clients/clients.module';
import { CatalogsModule } from './catalogs/catalogs.module';
import { UtilsModule } from './utils/utils.module';
import { AccountModule } from './account/account.module';
import { InvoiceConfigModule } from './invoice-config/invoice-config.module';
import { InvoicesModule } from './invoices/invoices.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { Client } from './entities/client.entity';
import { Admin } from './entities/admin.entity';
import { JobsModule } from './jobs/jobs.module';
import { ReportsModule } from './reports/reports.module';
import { Report } from './entities/report.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { TerminalModule } from './terminal/terminal.module';
import { SaleModule } from './sale/sale.module';
import { SaleItemModule } from './sale-item/sale-item.module';
import { RoyaltyModule } from './royalty/royalty.module';
import { CampaignModule } from './campaign/campaign.module';
import { CashboxModule } from './cashbox/cashbox.module';
import { DiscountRuleModule } from './discount-rule/discount-rule.module';
import { GiftCardModule } from './gift-card/gift-card.module';
import { GiftCardTransactionModule } from './gift-card-transaction/gift-card-transaction.module';
import { PaymentModule } from './payment/payment.module';
import { NotificationModule } from './notification/notification.module';
import { InventoryModule } from './inventory/inventory.module';
import { ReturnsModule } from './returns/returns.module';
import { ReturnItemsModule } from './return-items/return-items.module';
import { StoreModule } from './store/store.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, '..', '.env'),
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: 'mysql' as Dialect,
        host: configService.get<string>('DB_HOST'),
        port: +configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_SCHEMA'),
        autoLoadModels: true,
        synchronize: true, // Cambia a true solo en desarrollo
        models: [User, Profile, Client, Admin, Report],
        timezone: '-06:00',
        logging: configService.get<boolean>('DB_LOGGING', false)
          ? console.log
          : false,
      }),
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([
      User,
      Report,
    ]),
    EmailModule,
    ScheduleModule.forRoot(),
    AuthModule,
    ClientsModule,
    CatalogsModule,
    UtilsModule,
    AccountModule,
    InvoiceConfigModule,
    InvoicesModule,
    UsersModule,
    JobsModule,
    ReportsModule,
    ProductsModule,
    InventoryModule,
    TerminalModule,
    SaleModule,
    SaleItemModule,
    RoyaltyModule,
    CampaignModule,
    CashboxModule,
    DiscountRuleModule,
    GiftCardModule,
    GiftCardTransactionModule,
    PaymentModule,
    NotificationModule,
    ReturnsModule,
    ReturnItemsModule,
    StoreModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AppKeyGuard,
    },
  ],
})
export class AppModule {}
