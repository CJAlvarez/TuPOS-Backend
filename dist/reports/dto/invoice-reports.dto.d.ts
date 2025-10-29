import { BaseReportRequestDto, BaseReportResponseDto } from './base-report.dto';
export declare class LatestInvoicesRequestDto extends BaseReportRequestDto {
}
export declare class LatestInvoicesResponseDto extends BaseReportResponseDto {
    data: {
        invoices: Array<{
            id: number;
            client: string;
            total: number;
            title: string;
            number: string;
            date: string;
        }>;
    };
}
