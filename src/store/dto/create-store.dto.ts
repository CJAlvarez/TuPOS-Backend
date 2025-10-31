import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsObject } from 'class-validator';

export class CreateStoreDto {
  @ApiProperty() @IsString() code: string;
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() address: string;
  @ApiProperty() @IsString() phone: string;
  @ApiProperty() @IsString() email: string;
  @ApiPropertyOptional() @IsOptional() id_loyalty_type?: number;
  @ApiPropertyOptional() @IsOptional() loyalty_value?: number;
  @ApiPropertyOptional() @IsOptional() tax_included?: number;
  @ApiPropertyOptional({ 
    description: 'Theme configuration for white label stores',
    example: {
      name: 'default',
      colors: {
        primary: '#26547C',
        secondary: '#007a9d',
        success: '#1abc9c',
        danger: '#f1556c',
        warning: '#ffcf00',
        info: '#37cde6'
      }
    }
  }) 
  @IsOptional() 
  @IsObject() 
  theme_config?: any;
  @ApiPropertyOptional() @IsOptional() created_by?: number;
}