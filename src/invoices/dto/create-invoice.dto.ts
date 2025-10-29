import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsDate, IsInt } from 'class-validator';

export class CreateInvoiceDto {
  @ApiProperty()
  @IsInt()
  id_user: number;

  @ApiProperty()
  @IsString()
  number: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty()
  @IsString()
  client: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  store_name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  town?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ required: false, type: String, format: 'date-time' })
  @IsOptional()
  @IsDate()
  date?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  items?: string;

  @ApiProperty()
  @IsNumber()
  total: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ref?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  file?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  created_by?: number;

  @ApiProperty({ required: false, type: String, format: 'date-time' })
  @IsOptional()
  @IsDate()
  created_at?: Date;

  @ApiPropertyOptional({ description: 'ID de la tienda' })
  @IsOptional()
  @IsInt()
  id_store?: number;
}
