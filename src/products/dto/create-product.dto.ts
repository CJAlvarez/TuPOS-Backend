import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  code: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  box_price: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  unit_price: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  unit_discount_percent?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  unit_discount?: number;
  @ApiPropertyOptional()

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id_unit_discount_type?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  box_discount_percent?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  box_discount?: number;
  @ApiPropertyOptional()

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id_box_discount_type?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  tax_percent?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  min_stock?: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  box_amount: number;

  @ApiProperty()
  @IsNumber()
  loyalty_eligible: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  created_by?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id_store?: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  id_type: number;
}
