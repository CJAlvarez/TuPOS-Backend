import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Report } from '../entities/report.entity';
import { Invoice } from '../entities/invoice.entity';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report)
    private reportModel: typeof Report,

    @InjectModel(Invoice)
    private invoiceModel: typeof Invoice,
    private sequelize: Sequelize,
  ) {}
}
