import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class DeleteUserDto {
  @ApiProperty({ description: 'ID del usuario a eliminar' })
  @IsNumber()
  id_user: number;
}
