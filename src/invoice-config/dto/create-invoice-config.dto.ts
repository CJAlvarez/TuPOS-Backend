import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateInvoiceConfigDto {
  @ApiProperty()
  @IsString()
  config: string;

  @ApiProperty()
  @IsString()
  printer_ip: string;

  @ApiProperty()
  @IsString()
  printer_port: string;

  @ApiPropertyOptional({ description: 'ID de la tienda' })
  @IsOptional()
  @IsInt()
  id_store?: number;
}
