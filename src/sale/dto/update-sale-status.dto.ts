import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsBoolean } from 'class-validator';

export class UpdateSaleStatusDto {
  @ApiProperty({ description: 'ID de la venta' })
  @IsInt()
  id: number;

  @ApiProperty({ description: 'Estado activo/inactivo' })
  @IsBoolean()
  enable: boolean;
}