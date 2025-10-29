import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GiftCardTransaction } from '../entities/gift-card-transaction.entity';
import { GiftCardTransactionService } from './gift-card-transaction.service';
import { GiftCardTransactionController } from './gift-card-transaction.controller';
import { Admin } from 'src/entities/admin.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JobsModule } from 'src/jobs/jobs.module';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [
    SequelizeModule.forFeature([GiftCardTransaction, Admin]),
    AuthModule,
    JobsModule,
    UtilsModule,
  ],
  controllers: [GiftCardTransactionController],
  providers: [GiftCardTransactionService],
  exports: [GiftCardTransactionService],
})
export class GiftCardTransactionModule {}