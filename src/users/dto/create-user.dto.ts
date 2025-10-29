import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEmail, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({ description: 'Nombres del usuario' })
  @IsString()
  firstname: string;

  @ApiProperty({ description: 'Apellidos del usuario' })
  @IsString()
  lastname: string;

  @ApiProperty({ description: 'ID del país' })
  @Type(() => Number)
  @IsNumber()
  id_country: number;

  @ApiProperty({ description: 'Identificación oficial' })
  @IsString()
  identification: string;

  @ApiProperty({ description: 'ID del género' })
  @Type(() => Number)
  @IsNumber()
  id_gender: number;

  @ApiProperty({ description: 'Correo electrónico' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Teléfono' })
  @IsString()
  phone: string;

  @ApiProperty({ description: 'Tipo de admin (opcional)', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id_admin_type: number;

  @ApiProperty({ description: 'Contraseña (opcional)', required: false })
  @IsOptional()
  @IsString()
  password?: string;
}
