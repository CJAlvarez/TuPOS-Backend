import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateInvoiceConfigDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  config?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  printer_ip?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  printer_port?: string;
}
