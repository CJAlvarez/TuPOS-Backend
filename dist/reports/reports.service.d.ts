import { Report } from '../entities/report.entity';
import { Invoice } from '../entities/invoice.entity';
import { Sequelize } from 'sequelize-typescript';
export declare class ReportsService {
    private reportModel;
    private invoiceModel;
    private sequelize;
    constructor(reportModel: typeof Report, invoiceModel: typeof Invoice, sequelize: Sequelize);
}
