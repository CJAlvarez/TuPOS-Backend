import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InvoiceConfigService } from './invoice-config.service';
import { CreateInvoiceConfigDto } from './dto/create-invoice-config.dto';
import { UpdateInvoiceConfigDto } from './dto/update-invoice-config.dto';
import { InvoiceConfig } from '../entities/invoice-config.entity';
import { VerifyAdminAdminGuard } from '../auth/guards/verify-admin-admin.guard';
import { VerifyDisabledUserGuard } from '../auth/guards/verify-disabled-user.guard';
import { VerifyTokenGuard } from 'src/auth/guards/verify-token.guard';

@ApiTags('invoice-config')
@Controller('invoice-config')
@UseGuards(VerifyTokenGuard, VerifyDisabledUserGuard, VerifyAdminAdminGuard)
export class InvoiceConfigController {
  constructor(private readonly service: InvoiceConfigService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener la configuración de facturación (primer registro)',
  })
  @ApiResponse({ status: 200, type: InvoiceConfig })
  findAll(@Request() req) {
    return this.service.findAll(req.internal_store_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener configuración de facturación por ID' })
  @ApiResponse({ status: 200, type: InvoiceConfig })
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear configuración de facturación' })
  @ApiResponse({ status: 201, type: InvoiceConfig })
  create(@Request() req, @Body() dto: CreateInvoiceConfigDto) {
    return this.service.create(req.internal_store_id, dto);
  }

  @Put()
  @ApiOperation({ summary: 'Actualizar configuración de facturación' })
  @ApiResponse({ status: 200, type: InvoiceConfig })
  update(@Body() dto: UpdateInvoiceConfigDto) {
    return this.service.update(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar configuración de facturación' })
  @ApiResponse({
    status: 200,
    schema: { example: { message: 'Configuración eliminada' } },
  })
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
