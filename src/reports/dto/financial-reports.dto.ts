import { ApiProperty } from '@nestjs/swagger';
import { BaseReportRequestDto, BaseReportResponseDto } from './base-report.dto';

// Tendencia Mensual DTO
export class MonthlyTrendRequestDto extends BaseReportRequestDto {}

export class MonthlyTrendResponseDto extends BaseReportResponseDto {
  @ApiProperty({ 
    description: 'Datos de tendencia mensual',
    type: 'object',
    properties: {
      months: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            month: { type: 'string' },
            income: { type: 'number' },
            outcome: { type: 'number' },
          }
        }
      }
    }
  })
  declare data: {
    months: Array<{
      month: string;
      income: number;
      outcome: number;
    }>;
  };
}

// Tendencia Anual DTO
export class YearlyTrendRequestDto extends BaseReportRequestDto {}

export class YearlyTrendResponseDto extends BaseReportResponseDto {
  @ApiProperty({ 
    description: 'Datos de tendencia anual',
    type: 'object',
    properties: {
      years: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            year: { type: 'string' },
            income: { type: 'number' },
            outcome: { type: 'number' },
            balance: { type: 'number' }
          }
        }
      }
    }
  })
  declare data: {
    years: Array<{
      year: string;
      income: number;
      outcome: number;
      balance: number;
    }>;
  };
}

// Ingresos del día DTO
export class DailyIncomeRequestDto extends BaseReportRequestDto {}

export class DailyIncomeResponseDto extends BaseReportResponseDto {
  @ApiProperty({ 
    description: 'Ingresos del día',
    type: 'object',
    properties: {
      total: { type: 'number' },
      date: { type: 'string' },
    }
  })
  declare data: {
    total: number;
    date: string;
  };
}

// Egresos del día DTO
export class DailyOutcomeRequestDto extends BaseReportRequestDto {}

export class DailyOutcomeResponseDto extends BaseReportResponseDto {
  @ApiProperty({ 
    description: 'Egresos del día',
    type: 'object',
    properties: {
      total: { type: 'number' },
      date: { type: 'string' },
    }
  })
  declare data: {
    total: number;
    date: string;
  };
}