import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class UpdateReturnItemDto {
  @ApiProperty({ description: 'ID del item de devolución' })
  @IsInt()
  id: number;

  @ApiProperty({ description: 'ID de la devolución' })
  @IsInt()
  id_return: number;

  @ApiProperty({ description: 'ID del producto' })
  @IsInt()
  id_product: number;

  @ApiProperty({ description: 'ID del item de venta' })
  @IsInt()
  id_sale_item: number;
}
