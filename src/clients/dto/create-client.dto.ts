import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { UserClientDto } from './user-client.dto';
import { ProfileClientDto } from './profile-client.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({
    type: () => UserClientDto,
    description: 'Datos de usuario para el cliente',
  })
  @ValidateNested()
  @Type(() => UserClientDto)
  user: UserClientDto;

  @ApiProperty({
    type: () => ProfileClientDto,
    description: 'Datos de perfil para el cliente',
  })
  @ValidateNested()
  @Type(() => ProfileClientDto)
  profile: ProfileClientDto;
}
