import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsBoolean } from 'class-validator';

export class UpdateReturnItemStatusDto {
  @ApiProperty({ description: 'ID del item de devolución' })
  @IsInt()
  id: number;

  @ApiProperty({ description: 'Estado activo/inactivo' })
  @IsBoolean()
  enable: boolean;
}
