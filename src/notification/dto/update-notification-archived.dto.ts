import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class UpdateNotificationArchivedDto {
  @ApiProperty({ description: 'ID de la notificación' })
  @IsInt()
  id: number;
}