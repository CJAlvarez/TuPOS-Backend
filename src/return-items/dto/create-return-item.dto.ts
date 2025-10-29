import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class CreateReturnItemDto {
  @ApiProperty({ description: 'ID de la devolución' })
  @IsInt()
  id_return: number;

  @ApiProperty({ description: 'ID del producto' })
  @IsInt()
  id_product: number;

  @ApiProperty({ description: 'ID del item de venta' })
  @IsInt()
  id_sale_item: number;

  @ApiPropertyOptional({ description: 'ID de la tienda' })
  @IsOptional()
  @IsInt()
  id_store?: number;
}
