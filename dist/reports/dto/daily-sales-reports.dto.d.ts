import { BaseReportRequestDto, BaseReportResponseDto } from './base-report.dto';
export declare class DailySalesRequestDto extends BaseReportRequestDto {
}
export declare class DailySalesResponseDto extends BaseReportResponseDto {
    data: Array<{
        date: string;
        number: string;
        subtotal: number;
        discount_total: number;
        tax_total: number;
        total: number;
    }>;
}
