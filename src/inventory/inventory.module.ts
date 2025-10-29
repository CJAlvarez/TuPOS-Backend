import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Inventory } from '../entities/inventory.entity';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { Admin } from 'src/entities/admin.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JobsModule } from 'src/jobs/jobs.module';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Inventory, Admin]),
    AuthModule,
    JobsModule,
    UtilsModule,
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
