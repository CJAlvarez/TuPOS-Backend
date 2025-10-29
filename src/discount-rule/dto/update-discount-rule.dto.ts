import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDiscountRuleDto } from './create-discount-rule.dto';
import { IsInt } from 'class-validator';

export class UpdateDiscountRuleDto extends PartialType(CreateDiscountRuleDto) {
  @ApiProperty({ description: 'ID de la regla de descuento' })
  @IsInt()
  id: number;
}