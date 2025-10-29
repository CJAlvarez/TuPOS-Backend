import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class CreateSaleItemDto {
  @ApiProperty() @IsInt() id_sale: number;
  @ApiProperty() @IsInt() id_product: number;
  @ApiProperty() @IsInt() quantity: number;
  @ApiProperty() @IsNumber() price: number;
  @ApiPropertyOptional() @IsOptional() created_by?: number;
  
  @ApiPropertyOptional({ description: 'ID de la tienda' })
  @IsOptional()
  @IsInt()
  id_store?: number;
}