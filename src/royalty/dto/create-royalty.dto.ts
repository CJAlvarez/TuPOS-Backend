import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsDate, IsOptional } from 'class-validator';

export class CreateRoyaltyDto {
  @ApiProperty() @IsInt() id_client: number;
  @ApiProperty() @IsInt() id_sale: number;
  @ApiProperty() @IsInt() id_status: number;
  @ApiProperty() @IsNumber() points: number;
  @ApiProperty() @IsInt() created_by: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() id_store?: number;
  @ApiProperty() @IsDate() expire_at: Date;
  @ApiPropertyOptional() @IsOptional() created_at?: Date;
}