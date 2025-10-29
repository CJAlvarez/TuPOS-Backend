import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateNotificationDto } from './create-notification.dto';
import { IsInt } from 'class-validator';

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {
  @ApiProperty({ description: 'ID de la notificación' })
  @IsInt()
  id: number;
}