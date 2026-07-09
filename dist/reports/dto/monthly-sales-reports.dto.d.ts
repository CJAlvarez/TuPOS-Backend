import { BaseReportResponseDto } from './base-report.dto';
export type MonthlySalesMode = 'summary' | 'detailed';
export declare class MonthlySalesRequestDto {
    month: number;
    year: number;
    mode: MonthlySalesMode;
}
export declare class MonthlySalesResponseDto extends BaseReportResponseDto {
    data: Array<{
        date: string;
        number?: string;
        sales_count?: number;
        subtotal: number;
        discount_total: number;
        tax_total: number;
        total: number;
    }>;
}
