import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Sale } from '../entities/sale.entity';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
import { Admin } from 'src/entities/admin.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JobsModule } from 'src/jobs/jobs.module';
import { UtilsModule } from 'src/utils/utils.module';
import { RoyaltyModule } from 'src/royalty/royalty.module';
import { GiftCardModule } from 'src/gift-card/gift-card.module';
import { InventoryModule } from 'src/inventory/inventory.module';
import { PaymentModule } from 'src/payment/payment.module';
import { SaleItemModule } from 'src/sale-item/sale-item.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Sale, Admin]),
    AuthModule,
    JobsModule,
    UtilsModule,
    RoyaltyModule,
    GiftCardModule,
    InventoryModule,
    PaymentModule,
    SaleItemModule,
  ],
  controllers: [SaleController],
  providers: [SaleService],
  exports: [SaleService],
})
export class SaleModule {}
