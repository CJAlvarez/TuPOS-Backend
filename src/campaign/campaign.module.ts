import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Campaign } from '../entities/campaign.entity';
import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';
import { Admin } from 'src/entities/admin.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JobsModule } from 'src/jobs/jobs.module';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Campaign, Admin]),
    AuthModule,
    JobsModule,
    UtilsModule,
  ],
  controllers: [CampaignController],
  providers: [CampaignService],
  exports: [CampaignService],
})
export class CampaignModule {}