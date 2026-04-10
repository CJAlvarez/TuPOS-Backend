import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GiftCard } from '../entities/gift-card.entity';
import { GiftCardService } from './gift-card.service';
import { GiftCardController } from './gift-card.controller';
import { Admin } from 'src/entities/admin.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JobsModule } from 'src/jobs/jobs.module';
import { UtilsModule } from 'src/utils/utils.module';
import { GiftCardTransaction } from 'src/entities/gift-card-transaction.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([GiftCard, GiftCardTransaction, Admin]),
    AuthModule,
    JobsModule,
    UtilsModule,
  ],
  controllers: [GiftCardController],
  providers: [GiftCardService],
  exports: [GiftCardService],
})
export class GiftCardModule {}
