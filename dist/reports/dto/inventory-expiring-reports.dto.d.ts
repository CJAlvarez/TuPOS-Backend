import { BaseReportRequestDto, BaseReportResponseDto } from './base-report.dto';
export declare class InventoryExpiringRequestDto extends BaseReportRequestDto {
}
export declare class InventoryExpiringResponseDto extends BaseReportResponseDto {
    data: Array<{
        name: string;
        code: string;
        created_at: string;
        expiration_date: string;
        unit_quantity: number;
    }>;
}
