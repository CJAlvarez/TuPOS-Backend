import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Store } from '../entities/store.entity';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { Admin } from 'src/entities/admin.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JobsModule } from 'src/jobs/jobs.module';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Store, Admin]),
    AuthModule,
    JobsModule,
    UtilsModule,
  ],
  controllers: [StoreController],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
