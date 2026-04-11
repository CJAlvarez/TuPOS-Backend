import { ApiProperty } from '@nestjs/swagger';
import { BaseReportRequestDto, BaseReportResponseDto } from './base-report.dto';

// Reporte de Inventario Bajo DTO
export class InventoryLowRequestDto extends BaseReportRequestDto {}

export class InventoryLowResponseDto extends BaseReportResponseDto {
  @ApiProperty({
    description: 'Productos con inventario bajo',
    type: 'object',
    properties: {
      sales: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            code: { type: 'string' },
            min_stock: { type: 'number' },
            stock: { type: 'number' },
          },
        },
      },
    },
  })
  declare data: Array<{
    name: string;
    code: string;
    min_stock: number;
    stock: number;
  }>;
}
