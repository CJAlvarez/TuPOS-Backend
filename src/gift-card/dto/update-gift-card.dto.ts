import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateGiftCardDto } from './create-gift-card.dto';
import { IsInt } from 'class-validator';

export class UpdateGiftCardDto extends PartialType(CreateGiftCardDto) {
  @ApiProperty({ description: 'ID de la gift card' })
  @IsInt()
  id: number;
}