import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Return } from '../entities/return.entity';
import { ReturnsService } from './returns.service';
import { ReturnsController } from './returns.controller';
import { UtilsModule } from '../utils/utils.module';
import { Admin } from 'src/entities/admin.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JobsModule } from 'src/jobs/jobs.module';
import { SaleItem } from 'src/entities/sale-item.entity';
import { ReturnItem } from 'src/entities/return-item.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Return, ReturnItem, SaleItem, Admin]),
    AuthModule,
    JobsModule,
    UtilsModule,
  ],
  controllers: [ReturnsController],
  providers: [ReturnsService],
  exports: [ReturnsService],
})
export class ReturnsModule {}
