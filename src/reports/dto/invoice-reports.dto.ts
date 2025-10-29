import { ApiProperty } from '@nestjs/swagger';
import { BaseReportRequestDto, BaseReportResponseDto } from './base-report.dto';

// Últimos recibos DTO
export class LatestInvoicesRequestDto extends BaseReportRequestDto {}

export class LatestInvoicesResponseDto extends BaseReportResponseDto {
  @ApiProperty({
    description: 'Últimos 5 recibos',
    type: 'object',
    properties: {
      invoices: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            client: { type: 'string' },
            total: { type: 'number' },
            title: { type: 'string' },
            number: { type: 'string' },
            date: { type: 'string' },
          },
        },
      },
    },
  })
  declare data: {
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
