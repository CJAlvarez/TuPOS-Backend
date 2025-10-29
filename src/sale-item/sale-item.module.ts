import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SaleItem } from '../entities/sale-item.entity';
import { SaleItemService } from './sale-item.service';
import { SaleItemController } from './sale-item.controller';
import { Admin } from 'src/entities/admin.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JobsModule } from 'src/jobs/jobs.module';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [
    SequelizeModule.forFeature([SaleItem, Admin]),
    AuthModule,
    JobsModule,
    UtilsModule,
  ],
  controllers: [SaleItemController],
  providers: [SaleItemService],
  exports: [SaleItemService],
})
export class SaleItemModule {}