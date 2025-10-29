import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JobsService } from './jobs.service';
import { Job } from '../entities/job.entity';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [SequelizeModule.forFeature([Job])],
  providers: [JobsService, EmailService],
  exports: [JobsService],
})
export class JobsModule {}
