import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RecoverPasswordDto {
  @ApiProperty({ description: 'Correo electrónico del usuario' })
  @IsString()
  @IsNotEmpty()
  email: string;
}
