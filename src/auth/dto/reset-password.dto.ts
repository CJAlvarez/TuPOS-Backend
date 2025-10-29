import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Token de recuperación' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ description: 'Nueva contraseña' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'Confirmación de la nueva contraseña' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  confirmPassword: string;

  @ApiProperty({ description: 'Correo Electrónico', required: false })
  @IsString()
  @IsNotEmpty()
  email?: string;
}
