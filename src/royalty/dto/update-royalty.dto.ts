import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRoyaltyDto } from './create-royalty.dto';
import { IsInt } from 'class-validator';

export class UpdateRoyaltyDto extends PartialType(CreateRoyaltyDto) {
  @ApiProperty({ description: 'ID de la lealtad' })
  @IsInt()
  id: number;
}