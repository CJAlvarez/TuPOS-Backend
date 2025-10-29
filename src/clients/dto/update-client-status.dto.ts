import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsBoolean } from 'class-validator';

export class UpdateClientStatusDto {
  @ApiProperty({ description: 'ID del usuario (cliente)' })
  @IsNumber()
  id: number; // id_user

  @ApiProperty({ description: 'true para habilitar, false para deshabilitar' })
  @IsBoolean()
  enable: boolean;
}
