import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class OpenCashboxDto {
  @ApiProperty({ description: 'ID de la caja' })
  @IsInt()
  id: number;
}