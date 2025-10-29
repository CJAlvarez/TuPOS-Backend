import { IsNumber } from 'class-validator';

export class ClientStatusDto {
  @IsNumber()
  userId: number; // Usuario que realiza la acción
}
