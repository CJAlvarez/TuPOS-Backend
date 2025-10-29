import { BaseReportRequestDto, BaseReportResponseDto } from './base-report.dto';
export declare class MonthlyInterestsRequestDto extends BaseReportRequestDto {
}
export declare class MonthlyInterestsResponseDto extends BaseReportResponseDto {
    data: {
        totalInterests: number;
        month: string;
    };
}
export declare class LatestTransactionsRequestDto extends BaseReportRequestDto {
}
export declare class LatestTransactionsResponseDto extends BaseReportResponseDto {
    data: {
        transactions: Array<{
            id: number;
            walletId: number;
            walletNumber: string;
            eventType: string;
            clientName: string;
            amount: number;
            balance: number;
            createdAt: string;
        }>;
    };
}
export declare class TopTransactionsRequestDto extends BaseReportRequestDto {
}
export declare class TopTransactionsResponseDto extends BaseReportResponseDto {
    data: {
        transactions: Array<{
            id: number;
            walletId: number;
            walletNumber: string;
            eventType: string;
            clientName: string;
            amount: number;
            balance: number;
            date: string;
        }>;
    };
}
