import { PartialType } from '@nestjs/mapped-types';
import { CreateClientDto } from './create-client.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsObject } from 'class-validator';

export class UpdateClientDto extends PartialType(CreateClientDto) {
  @ApiPropertyOptional({ description: 'Datos de usuario a actualizar' })
  @IsOptional()
  @IsObject()
  user?: any;

  @ApiPropertyOptional({ description: 'Datos de perfil a actualizar' })
  @IsOptional()
  @IsObject()
  profile?: any;
}
