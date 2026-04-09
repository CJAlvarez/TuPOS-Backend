import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Job } from '../entities/job.entity';
import { Op } from 'sequelize';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { JobDto } from './dto/job.dto';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class JobsService implements OnModuleInit {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    @InjectModel(Job) private readonly jobModel: typeof Job,
    private readonly emailService: EmailService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  async onModuleInit() {
    if (process.env.EXECUTE_JOBS_EVERY) {
      const job = new CronJob(
        `*/${process.env.EXECUTE_JOBS_EVERY} * * * *`,
        () => {
          this.processJobs();
        },
        null,
        true,
        process.env.TZ || 'America/Tegucigalpa',
      );
      this.schedulerRegistry.addCronJob('processJobs', job);
    }
  }

  async addJob(jobDto: JobDto) {
    await this.jobModel.create({
      type: jobDto.type,
      data: jobDto.data,
      status: 'pending',
    });
  }

  async processJobs() {
    const jobs = await this.jobModel.findAll({
      where: {
        status: 'pending',
        created_at: { [Op.lte]: new Date() },
      },
    });

    for (const job of jobs) {
      try {
        // Emails
        if (job.getDataValue('type') === 'sendEmail') {
          await this.emailService.sendEmail(job.getDataValue('data'));
        } else if (job.getDataValue('type') === 'sendEmailTemplate') {
          await this.emailService.sendEmailTemplate(job.getDataValue('data'));
        }
        job.setDataValue('status', 'completed');
        job.setDataValue('completed_at', new Date());
        await job.save();
      } catch (error) {
        this.logger.error(
          `Failed to process job ${job.id}: ${(error as Error).message}`,
        );
        job.setDataValue('status', 'failed');
        await job.save();
      }
    }
  }
}
