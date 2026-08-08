import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserAdminDto } from './user-admin.dto';
import { ProfileAdminDto } from './profile-admin.dto';

export class CreateUserDto {
  @ApiProperty({
    type: () => UserAdminDto,
    description: 'Datos de usuario para el administrador',
  })
  @ValidateNested()
  @Type(() => UserAdminDto)
  user: UserAdminDto;

  @ApiProperty({
    type: () => ProfileAdminDto,
    description: 'Datos de perfil para el administrador',
  })
  @ValidateNested()
  @Type(() => ProfileAdminDto)
  profile: ProfileAdminDto;

  @ApiPropertyOptional({ description: 'Tipo de administrador' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id_admin_type?: number;
}
