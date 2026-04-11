import { ApiProperty } from '@nestjs/swagger';
import { BaseReportRequestDto, BaseReportResponseDto } from './base-report.dto';

// Reporte de Inventario por Vencer DTO
export class InventoryExpiringRequestDto extends BaseReportRequestDto {}

export class InventoryExpiringResponseDto extends BaseReportResponseDto {
  @ApiProperty({
    description: 'Productos con inventario por vencer',
    type: 'object',
    properties: {
      sales: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            code: { type: 'string' },
            created_at: { type: 'string' },
            expiration_date: { type: 'string' },
            unit_quantity: { type: 'number' },
          },
        },
      },
    },
  })
  declare data: Array<{
    name: string;
    code: string;
    created_at: string;
    expiration_date: string;
    unit_quantity: number;
  }>;
}
