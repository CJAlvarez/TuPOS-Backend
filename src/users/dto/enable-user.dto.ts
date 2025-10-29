import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsBoolean } from 'class-validator';

export class EnableUserDto {
  @ApiProperty({ description: 'ID del usuario', example: 123 })
  @IsNumber()
  id_user: number;

  @ApiProperty({
    description: 'Habilitar o deshabilitar usuario',
    example: true,
  })
  @IsBoolean()
  enable: boolean;
}
