import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsBoolean } from 'class-validator';

export class UpdatePaymentStatusDto {
  @ApiProperty({ description: 'ID del pago' })
  @IsInt()
  id: number;

  @ApiProperty({ description: 'Estado activo/inactivo' })
  @IsBoolean()
  enable: boolean;
}