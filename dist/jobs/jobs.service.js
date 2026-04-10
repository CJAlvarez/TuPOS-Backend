"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var JobsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const job_entity_1 = require("../entities/job.entity");
const sequelize_2 = require("sequelize");
const schedule_1 = require("@nestjs/schedule");
const cron_1 = require("cron");
const email_service_1 = require("../email/email.service");
let JobsService = JobsService_1 = class JobsService {
    jobModel;
    emailService;
    schedulerRegistry;
    logger = new common_1.Logger(JobsService_1.name);
    constructor(jobModel, emailService, schedulerRegistry) {
        this.jobModel = jobModel;
        this.emailService = emailService;
        this.schedulerRegistry = schedulerRegistry;
    }
    async onModuleInit() {
        if (process.env.EXECUTE_JOBS_EVERY) {
            const job = new cron_1.CronJob(`*/${process.env.EXECUTE_JOBS_EVERY} * * * *`, () => {
                this.processJobs();
            }, null, true, process.env.TZ || 'America/Tegucigalpa');
            this.schedulerRegistry.addCronJob('processJobs', job);
        }
    }
    async addJob(jobDto) {
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
                created_at: { [sequelize_2.Op.lte]: new Date() },
            },
        });
        for (const job of jobs) {
            try {
                if (job.getDataValue('type') === 'sendEmail') {
                    await this.emailService.sendEmail(job.getDataValue('data'));
                }
                else if (job.getDataValue('type') === 'sendEmailTemplate') {
                    await this.emailService.sendEmailTemplate(job.getDataValue('data'));
                }
                job.setDataValue('status', 'completed');
                job.setDataValue('completed_at', new Date());
                await job.save();
            }
            catch (error) {
                this.logger.error(`Failed to process job ${job.id}: ${error.message}`);
                job.setDataValue('status', 'failed');
                await job.save();
            }
        }
    }
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = JobsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(job_entity_1.Job)),
    __metadata("design:paramtypes", [Object, email_service_1.EmailService,
        schedule_1.SchedulerRegistry])
], JobsService);
//# sourceMappingURL=jobs.service.js.map