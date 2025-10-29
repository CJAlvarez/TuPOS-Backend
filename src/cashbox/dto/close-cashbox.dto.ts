import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CloseCashboxDto {
  @ApiProperty({ description: 'ID de la caja' })
  @IsInt()
  id: number;
}