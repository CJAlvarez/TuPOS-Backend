import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsNumber, IsDate, IsOptional } from 'class-validator';

export class CreateDiscountRuleDto {
  @ApiProperty() @IsString() name: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsInt() id_type: number;
  @ApiProperty() @IsNumber() value: number;
  @ApiProperty() @IsDate() start_date: Date;
  @ApiProperty() @IsDate() end_date: Date;
  @ApiPropertyOptional() @IsOptional() @IsInt() min_quantity?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() id_product?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() id_category?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() id_client?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() id_campaign?: number;
  @ApiProperty() @IsInt() created_by: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() id_store?: number;
  @ApiPropertyOptional() @IsOptional() @IsDate() created_at?: Date;
}