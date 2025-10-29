import { IsString, IsEmail } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  // Agrega más validaciones según el modelo original
}
