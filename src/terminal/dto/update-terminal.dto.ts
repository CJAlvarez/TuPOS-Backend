import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTerminalDto } from './create-terminal.dto';
import { IsInt } from 'class-validator';

export class UpdateTerminalDto extends PartialType(CreateTerminalDto) {
  @ApiProperty({ description: 'ID del terminal' })
  @IsInt()
  id: number;
}
