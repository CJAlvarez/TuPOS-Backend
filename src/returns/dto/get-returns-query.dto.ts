import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetReturnsQueryDto {
  @ApiPropertyOptional({ description: 'Palabra de búsqueda' })
  @IsOptional()
  @IsString()
  search_word?: string;

  @ApiPropertyOptional({ description: 'Número de registros a omitir' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number = 0;

  @ApiPropertyOptional({ description: 'Límite de registros' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Límite de registros' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id_sale?: number;
}
