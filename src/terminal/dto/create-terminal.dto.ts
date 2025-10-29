import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateTerminalDto {
  @ApiProperty() @IsInt() id_store: number;
  @ApiProperty() @IsString() code: string;
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsInt() id_address: number;
  @ApiProperty() @IsString() device: string;
  @ApiPropertyOptional() @IsOptional() last_sync?: Date;
  @ApiPropertyOptional() @IsOptional() created_by?: number;
}
