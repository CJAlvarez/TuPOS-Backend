import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class CreateGiftCardTransactionDto {
  @ApiProperty() @IsInt() id_gift_card: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() id_sale?: number;
  @ApiProperty() @IsInt() id_type: number;
  @ApiProperty() @IsNumber() amount: number;
  @ApiProperty() @IsInt() created_by: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() id_store?: number;
  @ApiPropertyOptional() @IsOptional() created_at?: Date;
}