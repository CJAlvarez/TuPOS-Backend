import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class FirstLoginDto {
  @ApiProperty({ description: 'Nueva contraseña' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'Confirmar nueva contraseña' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  confirmPassword: string;
}
