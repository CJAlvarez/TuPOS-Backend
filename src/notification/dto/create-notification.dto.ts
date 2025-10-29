import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty() @IsInt() id_status: number;
  @ApiProperty() @IsInt() id_type: number;
  @ApiProperty() @IsString() subject: string;
  @ApiProperty() @IsString() content: string;
  @ApiProperty() @IsInt() created_by: number;

  @ApiPropertyOptional({ description: 'ID de la tienda' })
  @IsOptional()
  @IsInt()
  id_store?: number;
}