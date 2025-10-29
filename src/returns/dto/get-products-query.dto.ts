import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class GetProductsQueryDto {
  @ApiPropertyOptional({ description: 'Límite de registros' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id_sale?: number;

  @ApiPropertyOptional({ description: 'Es para un insert/update' })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  insert?: boolean;
}
