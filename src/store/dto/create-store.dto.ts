import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateStoreDto {
  @ApiProperty() @IsString() code: string;
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() address: string;
  @ApiProperty() @IsString() phone: string;
  @ApiProperty() @IsString() email: string;
  @ApiPropertyOptional() @IsOptional() id_loyalty_type?: number;
  @ApiPropertyOptional() @IsOptional() loyalty_value?: number;
  @ApiPropertyOptional() @IsOptional() tax_included?: number;
  @ApiPropertyOptional() @IsOptional() created_by?: number;
}