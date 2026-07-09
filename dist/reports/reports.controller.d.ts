import { ReportsService } from './reports.service';
import { DailySalesRequestDto, DailySalesResponseDto } from './dto/daily-sales-reports.dto';
import { MonthlySalesRequestDto, MonthlySalesResponseDto } from './dto/monthly-sales-reports.dto';
import { InventoryLowRequestDto, InventoryLowResponseDto } from './dto/inventory-low-reports.dto';
import { InventoryExpiringRequestDto, InventoryExpiringResponseDto } from './dto/inventory-expiring-reports.dto';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getDailySales(req: any, dto: DailySalesRequestDto): Promise<DailySalesResponseDto>;
    getMonthlySales(req: any, dto: MonthlySalesRequestDto): Promise<MonthlySalesResponseDto>;
    getInventoryLow(req: any, dto: InventoryLowRequestDto): Promise<InventoryLowResponseDto>;
    getInventoryExpiring(req: any, dto: InventoryExpiringRequestDto): Promise<InventoryExpiringResponseDto>;
}
