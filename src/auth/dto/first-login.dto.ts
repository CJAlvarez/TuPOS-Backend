import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class FirstLoginDto {
  @ApiProperty({ description: 'Nueva contraseña' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    description:
      'Confirmación de la nueva contraseña. Nombre de campo usado por el frontend.',
  })
  @IsOptional()
  @IsString()
  confirm?: string;

  @ApiPropertyOptional({
    description:
      'Confirmación de la nueva contraseña. Alias aceptado para clientes que no usan "confirm".',
  })
  @IsOptional()
  @IsString()
  confirmPassword?: string;

  @ApiPropertyOptional({ description: 'Nombres del perfil' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstname?: string;

  @ApiPropertyOptional({ description: 'Apellidos del perfil' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastname?: string;

  @ApiPropertyOptional({
    description: 'Identificador del género. Llega como texto en multipart.',
  })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ description: 'Teléfono del perfil' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional({
    description:
      'Vista previa del avatar. Puede ser un data URL o el nombre de un recurso por defecto.',
  })
  @IsOptional()
  @IsString()
  src?: string;

  @ApiPropertyOptional({
    description:
      'Correo del usuario. Se acepta por compatibilidad con el formulario, pero no se modifica.',
  })
  @IsOptional()
  @IsString()
  email?: string;
}
