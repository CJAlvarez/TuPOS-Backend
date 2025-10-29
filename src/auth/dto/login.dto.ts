import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Correo electrónico o nombre de usuario' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'Contraseña' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
