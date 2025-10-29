import { OnModuleInit } from '@nestjs/common';
import { Job } from '../entities/job.entity';
import { JobDto } from './dto/job.dto';
import { EmailService } from 'src/email/email.service';
export declare class JobsService implements OnModuleInit {
    private readonly jobModel;
    private readonly emailService;
    private readonly logger;
    constructor(jobModel: typeof Job, emailService: EmailService);
    onModuleInit(): Promise<void>;
    addJob(jobDto: JobDto): Promise<void>;
    processJobs(): Promise<void>;
}
