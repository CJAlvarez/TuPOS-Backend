import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSaleItemDto } from './create-sale-item.dto';
import { IsInt } from 'class-validator';

export class UpdateSaleItemDto extends PartialType(CreateSaleItemDto) {
  @ApiProperty({ description: 'ID del item de venta' })
  @IsInt()
  id: number;
}