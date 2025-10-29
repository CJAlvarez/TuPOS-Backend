import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsInt } from 'class-validator';

export class BaseReportRequestDto {
  @ApiProperty({ 
    description: 'Fecha de inicio para el reporte (formato YYYY-MM-DD)',
    required: false,
    example: '2024-01-01'
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ 
    description: 'Fecha de fin para el reporte (formato YYYY-MM-DD)',
    required: false,
    example: '2024-12-31'
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'ID de la tienda' })
  @IsOptional()
  @IsInt()
  id_store?: number;
}

export class BaseReportResponseDto {
  @ApiProperty({ description: 'Código del reporte' })
  reportCode: string;

  @ApiProperty({ description: 'Nombre del reporte' })
  reportName: string;

  @ApiProperty({ description: 'Fecha de generación del reporte' })
  generatedAt: Date;

  @ApiProperty({ description: 'Tipo de reporte (PREPROCESSED o IMMEDIATE)' })
  reportType: string;

  @ApiProperty({ description: 'Datos del reporte' })
  data: any;
}