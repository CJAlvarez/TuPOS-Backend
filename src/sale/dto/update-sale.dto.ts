import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSaleDto } from './create-sale.dto';
import { IsInt } from 'class-validator';

export class UpdateSaleDto extends PartialType(CreateSaleDto) {
  @ApiProperty({ description: 'ID de la venta' })
  @IsInt()
  id: number;
}