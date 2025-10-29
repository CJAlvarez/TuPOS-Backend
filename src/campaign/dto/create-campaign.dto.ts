import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsDate, IsInt, IsOptional } from 'class-validator';

export class CreateCampaignDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() description: string;
  @ApiProperty() @IsDate() start_date: Date;
  @ApiProperty() @IsDate() end_date: Date;
  @ApiPropertyOptional() @IsOptional() created_by?: number;
  @ApiPropertyOptional() @IsOptional() id_store?: number;
  @ApiPropertyOptional() @IsOptional() created_at?: Date;
}