import { IsEnum, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class JobDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(['sendEmail', 'sendEmailTemplate'])
  type: string;

  @IsNotEmpty()
  @IsObject()
  data: any;
}
