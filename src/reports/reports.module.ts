import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Report } from '../entities/report.entity';
import { Client } from '../entities/client.entity';
import { Invoice } from '../entities/invoice.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Admin } from 'src/entities/admin.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Report,
      Client,
      Invoice,
      Admin
    ]),
    AuthModule
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
