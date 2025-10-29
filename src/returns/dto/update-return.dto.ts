import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateReturnDto {
  @ApiProperty({ description: 'ID de la devolución' })
  @IsInt()
  id: number;

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
}
