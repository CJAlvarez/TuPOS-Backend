import { Report } from '../entities/report.entity';
import { Sequelize } from 'sequelize-typescript';
import { DailySalesRequestDto, DailySalesResponseDto } from './dto/daily-sales-reports.dto';
export declare class ReportsService {
    private reportModel;
    private sequelize;
    constructor(reportModel: typeof Report, sequelize: Sequelize);
    private createBaseResponse;
    getDailySales(dto: DailySalesRequestDto, internal_store_id: number): Promise<DailySalesResponseDto>;
    getInventoryLow(dto: any, internal_store_id: number): Promise<any>;
    getInventoryExpiring(dto: any, internal_store_id: number): Promise<any>;
}
