import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsBoolean } from 'class-validator';

export class UpdateNotificationStatusDto {
  @ApiProperty({ description: 'ID de la notificación' })
  @IsInt()
  id: number;

  @ApiProperty({ description: 'Estado' })
  @IsBoolean()
  status: number;
}