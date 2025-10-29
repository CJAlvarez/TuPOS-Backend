import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCashboxDto } from './create-cashbox.dto';
import { IsInt } from 'class-validator';

export class UpdateCashboxDto extends PartialType(CreateCashboxDto) {
  @ApiProperty({ description: 'ID de la caja' })
  @IsInt()
  id: number;
}