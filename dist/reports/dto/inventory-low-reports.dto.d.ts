import { BaseReportRequestDto, BaseReportResponseDto } from './base-report.dto';
export declare class InventoryLowRequestDto extends BaseReportRequestDto {
}
export declare class InventoryLowResponseDto extends BaseReportResponseDto {
    data: Array<{
        name: string;
        code: string;
        min_stock: number;
        stock: number;
    }>;
}
