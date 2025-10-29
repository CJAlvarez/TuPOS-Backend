import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Sale } from '../entities/sale.entity';
import { SaleItem } from '../entities/sale-item.entity';
import { Product } from '../entities/product.entity';
import { Inventory } from '../entities/inventory.entity';
import { Payment } from '../entities/payment.entity';
import { GiftCard } from '../entities/gift-card.entity';
import { GiftCardTransaction } from '../entities/gift-card-transaction.entity';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
import { Admin } from 'src/entities/admin.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JobsModule } from 'src/jobs/jobs.module';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Sale,
      SaleItem,
      Product,
      Inventory,
      Payment,
      GiftCard,
      GiftCardTransaction,
      Admin,
    ]),
    AuthModule,
    JobsModule,
    UtilsModule,
  ],
  controllers: [SaleController],
  providers: [SaleService],
  exports: [SaleService],
})
export class SaleModule {}