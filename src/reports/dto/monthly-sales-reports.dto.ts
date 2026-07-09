import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseReportResponseDto } from './base-report.dto';

export type MonthlySalesMode = 'summary' | 'detailed';

// Reporte Mensual de Ventas DTO
export class MonthlySalesRequestDto {
  @ApiProperty({ description: 'Mes del reporte (1-12)', example: 7 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({ description: 'Año del reporte', example: 2026 })
  @Type(() => Number)
  @IsInt()
  year: number;

  @ApiProperty({
    description: 'Formato del reporte: resumen agregado por día o detalle de cada venta',
    enum: ['summary', 'detailed'],
    example: 'summary',
  })
  @IsIn(['summary', 'detailed'])
  mode: MonthlySalesMode;
}

export class MonthlySalesResponseDto extends BaseReportResponseDto {
  @ApiProperty({
    description: 'Ventas del mes, agregadas por día (mode=summary) o detalladas (mode=detailed)',
    type: 'object',
    properties: {
      sales: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            date: { type: 'string' },
            number: { type: 'string' },
            sales_count: { type: 'number' },
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
    number?: string;
    sales_count?: number;
    subtotal: number;
    discount_total: number;
    tax_total: number;
    total: number;
  }>;
}
