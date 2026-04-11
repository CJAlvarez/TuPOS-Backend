import { ApiProperty } from '@nestjs/swagger';
import { BaseReportRequestDto, BaseReportResponseDto } from './base-report.dto';

// Reporte Diario de Ventas DTO
export class DailySalesRequestDto extends BaseReportRequestDto {}

export class DailySalesResponseDto extends BaseReportResponseDto {
  @ApiProperty({
    description: 'Ventas del día',
    type: 'object',
    properties: {
      sales: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            date: { type: 'string' },
            number: { type: 'string' },
            subtotal: { type: 'number' },
            discount_total: { type: 'number' },
            tax_total: { type: 'number' },
            total: { type: 'number' },
          },
        },
      },
    },
  })
  declare data: Array<{
    date: string;
    number: string;
    subtotal: number;
    discount_total: number;
    tax_total: number;
    total: number;
  }>;
}
