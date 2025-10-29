import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ description: 'Contraseña actual' })
  @IsString()
  @IsNotEmpty()
  current_password: string;

  @ApiProperty({ description: 'Nueva contraseña' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'Confirmación de contraseña' })
  @IsString()
  @IsNotEmpty()
  confirm_password: string;
}
 