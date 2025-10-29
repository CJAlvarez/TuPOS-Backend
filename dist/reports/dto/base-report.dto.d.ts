export declare class BaseReportRequestDto {
    startDate?: string;
    endDate?: string;
    id_store?: number;
}
export declare class BaseReportResponseDto {
    reportCode: string;
    reportName: string;
    generatedAt: Date;
    reportType: string;
    data: any;
}
