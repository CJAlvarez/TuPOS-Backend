import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsInt, IsOptional, IsDate } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateGiftCardDto {
  @ApiProperty() @IsString() code: string;

  @ApiProperty() @IsNumber() initial_balance: number;

  @ApiProperty()
  @IsNumber()
  @ApiPropertyOptional()
  @IsOptional()
  current_balance: number;

  @ApiPropertyOptional() @IsOptional() @IsInt() id_client?: number;

  @ApiPropertyOptional() @IsOptional() @IsInt() created_by: number;

  @ApiPropertyOptional() @IsOptional() @IsInt() id_store?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  issued_at?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  expires_at?: Date;
}
