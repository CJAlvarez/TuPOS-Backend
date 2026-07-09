import { Report } from '../entities/report.entity';
import { Sequelize } from 'sequelize-typescript';
import { DailySalesRequestDto, DailySalesResponseDto } from './dto/daily-sales-reports.dto';
import { MonthlySalesRequestDto, MonthlySalesResponseDto } from './dto/monthly-sales-reports.dto';
export declare class ReportsService {
    private reportModel;
    private sequelize;
    constructor(reportModel: typeof Report, sequelize: Sequelize);
    private createBaseResponse;
    private getSalesRows;
    getDailySales(dto: DailySalesRequestDto, internal_store_id: number): Promise<DailySalesResponseDto>;
    getMonthlySales(dto: MonthlySalesRequestDto, internal_store_id: number): Promise<MonthlySalesResponseDto>;
    getInventoryLow(dto: any, internal_store_id: number): Promise<any>;
    getInventoryExpiring(dto: any, internal_store_id: number): Promise<any>;
}
