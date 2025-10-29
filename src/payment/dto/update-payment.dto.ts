import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePaymentDto } from './create-payment.dto';
import { IsInt } from 'class-validator';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {
  @ApiProperty({ description: 'ID del pago' })
  @IsInt()
  id: number;
}