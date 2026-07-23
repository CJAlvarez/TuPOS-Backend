import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ description: 'Datos de usuario a actualizar' })
  @IsOptional()
  @IsObject()
  user?: any;

  @ApiPropertyOptional({ description: 'Datos de perfil a actualizar' })
  @IsOptional()
  @IsObject()
  profile?: any;

  @ApiPropertyOptional({ description: 'Tipo de administrador' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id_admin_type?: number;
}
