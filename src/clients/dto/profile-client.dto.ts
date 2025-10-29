import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class ProfileClientDto {
  @ApiProperty({ description: 'Nombres del cliente' })
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({ description: 'Apellidos del cliente' })
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({ description: 'ID de género' })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  id_gender: number;

  @ApiProperty({ description: 'ID de país' })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  id_country: number;

  @ApiProperty({ description: 'Identificación' })
  @IsString()
  @IsNotEmpty()
  identification: string;

  @ApiPropertyOptional({ description: 'Teléfono' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'Dirección' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ description: 'Imagen de perfil' })
  @IsString()
  @IsOptional()
  image?: string;
}
