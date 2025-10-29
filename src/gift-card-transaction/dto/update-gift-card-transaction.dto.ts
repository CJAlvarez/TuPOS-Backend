import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateGiftCardTransactionDto } from './create-gift-card-transaction.dto';
import { IsInt } from 'class-validator';

export class UpdateGiftCardTransactionDto extends PartialType(CreateGiftCardTransactionDto) {
  @ApiProperty({ description: 'ID de la transacción de gift card' })
  @IsInt()
  id: number;
}