import { BaseReportRequestDto, BaseReportResponseDto } from './base-report.dto';
export declare class TopClientsRequestDto extends BaseReportRequestDto {
}
export declare class TopClientsResponseDto extends BaseReportResponseDto {
    data: {
        clients: Array<{
            clientId: number;
            clientName: string;
            movementCount: number;
            totalAmount: number;
        }>;
    };
}
export declare class ClientCountRequestDto extends BaseReportRequestDto {
}
export declare class ClientCountResponseDto extends BaseReportResponseDto {
    data: {
        totalClients: number;
        activeClients: number;
        inactiveClients: number;
    };
}
export declare class WalletCountRequestDto extends BaseReportRequestDto {
}
export declare class WalletCountResponseDto extends BaseReportResponseDto {
    data: {
        totalWallets: number;
        activeWallets: number;
        totalBalance: number;
    };
}
export declare class LoanCountRequestDto extends BaseReportRequestDto {
}
export declare class LoanCountResponseDto extends BaseReportResponseDto {
    data: {
        totalLoans: number;
        activeLoans: number;
        totalAmount: number;
        pendingAmount: number;
    };
}
