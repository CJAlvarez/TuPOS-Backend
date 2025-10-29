import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsNumber, IsOptional } from 'class-validator';

export class UserClientDto {
  @ApiProperty({ description: 'ID del usuario' })
  @IsNumber()
  @IsOptional()
  id: number;

  @ApiProperty({ description: 'Nombre de usuario' })
  @IsString()
  @IsOptional()
  username: string;

  @ApiProperty({ description: 'Contraseña' })
  @IsString()
  @IsOptional()
  password: string;

  @ApiProperty({ description: 'Correo electrónico' })
  @IsEmail()
  @IsOptional()
  email: string;
}
