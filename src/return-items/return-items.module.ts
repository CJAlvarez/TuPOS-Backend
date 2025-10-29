import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReturnItem } from '../entities/return-item.entity';
import { ReturnItemsService } from './return-items.service';
import { ReturnItemsController } from './return-items.controller';
import { UtilsModule } from '../utils/utils.module';
import { Admin } from 'src/entities/admin.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JobsModule } from 'src/jobs/jobs.module';

@Module({
  imports: [SequelizeModule.forFeature([ReturnItem, Admin]),
      AuthModule,
      JobsModule,
      UtilsModule,],
  controllers: [ReturnItemsController],
  providers: [ReturnItemsService],
  exports: [ReturnItemsService],
})
export class ReturnItemsModule {}
