import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString, IsDate, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty() @IsInt() id_sale: number;
  @ApiProperty() @IsInt() id_payment_method: number;
  @ApiProperty() @IsNumber() amount: number;
  @ApiPropertyOptional() @IsOptional() @IsString() reference?: string;
  @ApiProperty() @IsDate() date: Date;
  @ApiProperty() @IsInt() created_by: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() id_store?: number;
}