import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsBoolean } from 'class-validator';

export class UpdateGiftCardStatusDto {
  @ApiProperty({ description: 'ID de la gift card' })
  @IsInt()
  id: number;

  @ApiProperty({ description: 'Estado activo/inactivo' })
  @IsBoolean()
  enable: boolean;
}