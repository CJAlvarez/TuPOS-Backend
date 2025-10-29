import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateInventoryDto } from './create-inventory.dto';
import { IsInt } from 'class-validator';

export class UpdateInventoryDto extends PartialType(CreateInventoryDto) {
  @ApiProperty({ description: 'ID del inventario' })
  @IsInt()
  id: number;
}
