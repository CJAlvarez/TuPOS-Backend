import { ApiProperty } from '@nestjs/swagger';
import { BaseReportRequestDto, BaseReportResponseDto } from './base-report.dto';

// Intereses del mes DTO
export class MonthlyInterestsRequestDto extends BaseReportRequestDto {}

export class MonthlyInterestsResponseDto extends BaseReportResponseDto {
  @ApiProperty({ 
    description: 'Intereses generados en el mes',
    type: 'object',
    properties: {
      totalInterests: { type: 'number' },
      month: { type: 'string' },
    }
  })
  declare data: {
    totalInterests: number;
    month: string;
  };
}

// Últimas transacciones DTO
export class LatestTransactionsRequestDto extends BaseReportRequestDto {}

export class LatestTransactionsResponseDto extends BaseReportResponseDto {
  @ApiProperty({ 
    description: 'Últimas 5 transacciones',
    type: 'object',
    properties: {
      transactions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            walletId: { type: 'number' },
            walletNumber: { type: 'string' },
            eventType: { type: 'string' },
            clientName: { type: 'string' },
            amount: { type: 'number' },
            balance: { type: 'number' },
            date: { type: 'string' }
          }
        }
      }
    }
  })
  declare data: {
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

// Top transacciones DTO
export class TopTransactionsRequestDto extends BaseReportRequestDto {}

export class TopTransactionsResponseDto extends BaseReportResponseDto {
  @ApiProperty({ 
    description: 'Top 10 transacciones por balance',
    type: 'object',
    properties: {
      transactions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            walletId: { type: 'number' },
            walletNumber: { type: 'string' },
            eventType: { type: 'string' },
            clientName: { type: 'string' },
            amount: { type: 'number' },
            balance: { type: 'number' },
            date: { type: 'string' }
          }
        }
      }
    }
  })
  declare data: {
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