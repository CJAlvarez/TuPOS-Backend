import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsInt, IsDate, IsOptional } from 'class-validator';

export class CreateCashboxDto {
  @ApiProperty() @IsNumber() opening_amount: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() closing_amount?: number;
  @ApiProperty() @IsInt() created_by: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() id_store?: number;
  @ApiProperty() @IsDate() opened_at: Date;
  @ApiPropertyOptional() @IsOptional() @IsDate() closed_at?: Date;
}