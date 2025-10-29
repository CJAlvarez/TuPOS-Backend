import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import {
  MonthlyTrendResponseDto,
  YearlyTrendResponseDto,
  DailyIncomeResponseDto,
  DailyOutcomeResponseDto,
} from './financial-reports.dto';
import {
  TopClientsResponseDto,
  ClientCountResponseDto,
  WalletCountResponseDto,
  LoanCountResponseDto,
} from './client-reports.dto';
import {
  MonthlyInterestsResponseDto,
  LatestTransactionsResponseDto,
  TopTransactionsResponseDto,
} from './transaction-reports.dto';
import {
  LatestInvoicesResponseDto,
} from './invoice-reports.dto';

export class ConsolidatedReportsRequestDto {
  @ApiProperty({
    description: 'Fecha de inicio para reportes con rango de fechas (YYYY-MM-DD)',
    required: false,
    example: '2024-01-01'
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: 'Fecha de fin para reportes con rango de fechas (YYYY-MM-DD)',
    required: false,
    example: '2024-12-31'
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class ConsolidatedReportsResponseDto {
  @ApiProperty({
    description: 'Reportes financieros consolidados'
  })
  financial: {
    monthlyTrend: MonthlyTrendResponseDto;
    yearlyTrend: YearlyTrendResponseDto;
    dailyIncome: DailyIncomeResponseDto;
    dailyOutcome: DailyOutcomeResponseDto;
  };

  @ApiProperty({
    description: 'Reportes de clientes consolidados'
  })
  clients: {
    topClients: TopClientsResponseDto;
    clientCount: ClientCountResponseDto;
    walletCount: WalletCountResponseDto;
    loanCount: LoanCountResponseDto;
  };

  @ApiProperty({
    description: 'Reportes de transacciones consolidados'
  })
  transactions: {
    monthlyInterests: MonthlyInterestsResponseDto;
    latestTransactions: LatestTransactionsResponseDto;
    topTransactions: TopTransactionsResponseDto;
  };

  @ApiProperty({
    description: 'Reportes de facturas consolidados'
  })
  invoices: {
    latestInvoices: LatestInvoicesResponseDto;
  };

  @ApiProperty({
    description: 'Timestamp de cuando se generó el reporte consolidado',
    example: '2024-01-15T10:30:00Z'
  })
  generatedAt: string;
}