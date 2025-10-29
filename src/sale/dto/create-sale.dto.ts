import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString, IsArray, ValidateNested, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class SaleItemDto {
  @ApiProperty({ description: 'ID del producto' })
  @IsInt()
  id_product: number;

  @ApiProperty({ description: 'Cantidad (en unidades o cajas según sale_type)' })
  @IsInt()
  quantity: number;

  @ApiProperty({ description: 'Precio base unitario/caja' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Descuento total aplicado' })
  @IsNumber()
  discount: number;

  @ApiProperty({ description: 'Impuesto calculado' })
  @IsNumber()
  tax: number;

  @ApiProperty({ description: 'Total del item' })
  @IsNumber()
  total: number;

  @ApiPropertyOptional({ description: 'Tipo de venta: unit o box', enum: ['unit', 'box'] })
  @IsOptional()
  @IsEnum(['unit', 'box'])
  sale_type?: 'unit' | 'box';
}

export class AppliedGiftCardDto {
  @ApiProperty({ description: 'ID de la tarjeta de regalo' })
  @IsInt()
  id_gift_card: number;

  @ApiProperty({ description: 'Monto usado de la tarjeta' })
  @IsNumber()
  amount_used: number;
}

export class PaymentDto {
  @ApiProperty({ description: 'ID del método de pago' })
  @IsInt()
  id_payment_method: number;

  @ApiProperty({ description: 'Monto pagado' })
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({ description: 'Referencia del pago (número de transacción, cheque, etc.)' })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiPropertyOptional({ description: 'Notas del pago' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateSaleDto {
  @ApiPropertyOptional({ description: 'ID del cliente (opcional)' })
  @IsOptional()
  @IsInt()
  id_client?: number | null;

  @ApiProperty({ description: 'Subtotal de la venta' })
  @IsNumber()
  subtotal: number;

  @ApiProperty({ description: 'Total de descuentos' })
  @IsNumber()
  discount_total: number;

  @ApiProperty({ description: 'Total de impuestos' })
  @IsNumber()
  tax_total: number;

  @ApiProperty({ description: 'Total de la venta' })
  @IsNumber()
  total: number;

  @ApiProperty({ description: 'Fecha de la venta' })
  date: Date;

  @ApiProperty({ description: 'Items de la venta', type: [SaleItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items: SaleItemDto[];

  @ApiPropertyOptional({ description: 'Tarjetas de regalo aplicadas', type: [AppliedGiftCardDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AppliedGiftCardDto)
  gift_cards?: AppliedGiftCardDto[];

  @ApiProperty({ description: 'Información del pago', type: PaymentDto })
  @ValidateNested()
  @Type(() => PaymentDto)
  payment: PaymentDto;

  @ApiPropertyOptional({ description: 'Método de pago (deprecated, usar payment.id_payment_method)' })
  @IsOptional()
  @IsInt()
  id_payment_method?: number;

  @ApiPropertyOptional({ description: 'Estado de la venta' })
  @IsOptional()
  @IsInt()
  id_status?: number;

  @ApiPropertyOptional({ description: 'Notas adicionales' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Si el precio incluye impuestos' })
  @IsOptional()
  @IsBoolean()
  tax_included?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  created_by?: number;

  @ApiPropertyOptional({ description: 'ID de la tienda' })
  @IsOptional()
  @IsInt()
  id_store?: number;
}