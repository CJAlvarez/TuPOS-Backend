import { MonthlyTrendResponseDto, YearlyTrendResponseDto, DailyIncomeResponseDto, DailyOutcomeResponseDto } from './financial-reports.dto';
import { TopClientsResponseDto, ClientCountResponseDto, WalletCountResponseDto, LoanCountResponseDto } from './client-reports.dto';
import { MonthlyInterestsResponseDto, LatestTransactionsResponseDto, TopTransactionsResponseDto } from './transaction-reports.dto';
import { LatestInvoicesResponseDto } from './invoice-reports.dto';
export declare class ConsolidatedReportsRequestDto {
    startDate?: string;
    endDate?: string;
}
export declare class ConsolidatedReportsResponseDto {
    financial: {
        monthlyTrend: MonthlyTrendResponseDto;
        yearlyTrend: YearlyTrendResponseDto;
        dailyIncome: DailyIncomeResponseDto;
        dailyOutcome: DailyOutcomeResponseDto;
    };
    clients: {
        topClients: TopClientsResponseDto;
        clientCount: ClientCountResponseDto;
        walletCount: WalletCountResponseDto;
        loanCount: LoanCountResponseDto;
    };
    transactions: {
        monthlyInterests: MonthlyInterestsResponseDto;
        latestTransactions: LatestTransactionsResponseDto;
        topTransactions: TopTransactionsResponseDto;
    };
    invoices: {
        latestInvoices: LatestInvoicesResponseDto;
    };
    generatedAt: string;
}
