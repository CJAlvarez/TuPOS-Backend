import { IsInt, IsString, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInventoryDto {
  @ApiProperty()
  @IsInt()
  id_product: number;

  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsInt()
  box_quantity: number;

  @ApiProperty()
  @IsInt()
  unit_quantity: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expiration_date?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  created_by?: number;

  @ApiPropertyOptional({ description: 'ID de la tienda' })
  @IsOptional()
  @IsInt()
  id_store?: number;
}
