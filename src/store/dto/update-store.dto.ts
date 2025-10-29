import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateStoreDto } from './create-store.dto';
import { IsInt } from 'class-validator';

export class UpdateStoreDto extends PartialType(CreateStoreDto) {
  @ApiProperty({ description: 'ID de la tienda' })
  @IsInt()
  id: number;
}
