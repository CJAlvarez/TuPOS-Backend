import { BaseReportRequestDto, BaseReportResponseDto } from './base-report.dto';
export declare class MonthlyTrendRequestDto extends BaseReportRequestDto {
}
export declare class MonthlyTrendResponseDto extends BaseReportResponseDto {
    data: {
        months: Array<{
            month: string;
            income: number;
            outcome: number;
        }>;
    };
}
export declare class YearlyTrendRequestDto extends BaseReportRequestDto {
}
export declare class YearlyTrendResponseDto extends BaseReportResponseDto {
    data: {
        years: Array<{
            year: string;
            income: number;
            outcome: number;
            balance: number;
        }>;
    };
}
export declare class DailyIncomeRequestDto extends BaseReportRequestDto {
}
export declare class DailyIncomeResponseDto extends BaseReportResponseDto {
    data: {
        total: number;
        date: string;
    };
}
export declare class DailyOutcomeRequestDto extends BaseReportRequestDto {
}
export declare class DailyOutcomeResponseDto extends BaseReportResponseDto {
    data: {
        total: number;
        date: string;
    };
}
