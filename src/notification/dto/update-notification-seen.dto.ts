import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class UpdateNotificationSeenDto {
  @ApiProperty({ description: 'ID de la notificación' })
  @IsInt()
  id: number;
}