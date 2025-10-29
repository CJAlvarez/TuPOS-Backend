import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Royalty } from '../entities/royalty.entity';
import { RoyaltyService } from './royalty.service';
import { RoyaltyController } from './royalty.controller';
import { Admin } from 'src/entities/admin.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JobsModule } from 'src/jobs/jobs.module';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Royalty, Admin]),
    AuthModule,
    JobsModule,
    UtilsModule,
  ],
  controllers: [RoyaltyController],
  providers: [RoyaltyService],
  exports: [RoyaltyService],
})
export class RoyaltyModule {}