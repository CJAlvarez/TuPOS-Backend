import { IsBoolean, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductStatusDto {
  @ApiProperty({ description: 'ID del producto' })
  @IsInt()
  id: number;

  @ApiProperty({ description: 'Estado activo/inactivo' })
  @IsBoolean()
  enable: boolean;
}