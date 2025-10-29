import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice } from '../entities/invoice.entity';
import { VerifyAdminAdminGuard } from '../auth/guards/verify-admin-admin.guard';
import { VerifyDisabledUserGuard } from '../auth/guards/verify-disabled-user.guard';
import { VerifyTokenGuard } from 'src/auth/guards/verify-token.guard';

@ApiTags('invoices')
@Controller('invoices')
@UseGuards(VerifyTokenGuard, VerifyDisabledUserGuard, VerifyAdminAdminGuard)
export class InvoicesController {
  constructor(private readonly service: InvoicesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener lista de facturas' })
  @ApiResponse({
    status: 200,
    schema: { example: { count: 100, list: [], skip: 0 } },
  })
  findAll(@Request() req, @Query() query: any) {
    return this.service.findAll(query, req.internal_store_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de factura' })
  @ApiResponse({ status: 200, type: Invoice })
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear factura' })
  @ApiResponse({ status: 201, type: Invoice })
  create(@Request() req, @Body() dto: CreateInvoiceDto) {
    return this.service.create(req.internal_user_id, req.internal_store_id, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar factura' })
  @ApiResponse({ status: 200, type: Invoice })
  update(@Param('id') id: number, @Body() dto: UpdateInvoiceDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar factura' })
  @ApiResponse({
    status: 200,
    schema: { example: { message: 'Factura eliminada' } },
  })
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
