import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReturnDto {
  @ApiProperty({ description: 'ID de la venta' })
  @IsInt()
  id_sale: number;

  @ApiProperty({ description: 'ID del cliente' })
  @IsInt()
  id_client: number;

  @ApiProperty({ description: 'ID de la terminal' })
  @IsInt()
  id_terminal: number;

  @ApiProperty({ description: 'ID de la factura', required: false })
  @IsOptional()
  @IsInt()
  id_invoice?: number;

  @ApiProperty({ description: 'Fecha de la devolución' })
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'Total de la devolución' })
  @Type(() => Number)
  @IsNumber()
  total: number;

  @ApiProperty({ description: 'Razón de la devolución', required: false })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({ description: 'Estado de la devolución' })
  @IsString()
  status: string;

  @ApiProperty({ description: 'ID de la tienda', required: false })
  @IsOptional()
  @IsInt()
  id_store?: number;

  @ApiProperty({ description: 'Items de la devolución' })
  return_items: number[];

  @ApiProperty({ description: 'Items de la devolución RAW' })
  _return_items: any[];
}
