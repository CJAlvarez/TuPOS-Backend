import {
  Controller, Get, Post, Body, Param, Delete, UsePipes, ValidationPipe, Request, Put, UseGuards, Query,
} from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { GetSalesQueryDto } from './dto/get-sales-query.dto';
import { UpdateSaleStatusDto } from './dto/update-sale-status.dto';
import { ApiTags, ApiResponse, ApiOperation, ApiBody } from '@nestjs/swagger';
import { Sale } from '../entities/sale.entity';
import { SaleService } from './sale.service';
import { VerifyTokenGuard } from 'src/auth/guards/verify-token.guard';
import { VerifyDisabledUserGuard } from 'src/auth/guards/verify-disabled-user.guard';
import { VerifyAdminAdminGuard } from 'src/auth/guards/verify-admin-admin.guard';

@ApiTags('sales')
@Controller('sales')
@UseGuards(VerifyTokenGuard, VerifyDisabledUserGuard, VerifyAdminAdminGuard)
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las ventas (paginado y búsqueda)' })
  @ApiResponse({ status: 200, description: 'Lista de ventas paginada', type: Object })
  findAll(@Request() req, @Query() query: GetSalesQueryDto): Promise<any> {
    return this.saleService.findAll(query, req.internal_store_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una venta por ID' })
  @ApiResponse({ status: 200, description: 'Venta encontrada', type: Sale })
  @ApiResponse({ status: 404, description: 'Venta no encontrada' })
  findOne(@Param('id') id: string): Promise<Sale | null> {
    return this.saleService.findOne(Number(id));
  }

  @Post()
  @ApiOperation({ summary: 'Crear una venta' })
  @ApiResponse({ status: 201, description: 'Venta creada', type: Sale })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  create(@Request() req, @Body() data: CreateSaleDto): Promise<Sale> {
    return this.saleService.create(req.internal_user_id, req.internal_store_id, data);
  }

  @Put()
  @ApiOperation({ summary: 'Actualizar una venta' })
  @ApiResponse({ status: 200, description: 'Venta actualizada', type: Sale })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  update(@Body() dto: UpdateSaleDto): Promise<[number, Sale[]]> {
    return this.saleService.update(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una venta (soft delete)' })
  @ApiResponse({ status: 200, description: 'Venta eliminada' })
  remove(@Request() req, @Param('id') id: string): Promise<number> {
    return this.saleService.remove(req.internal_user_id, Number(id));
  }

  @Put('status')
  @ApiOperation({ summary: 'Habilitar o deshabilitar venta' })
  @ApiBody({ type: UpdateSaleStatusDto })
  @ApiResponse({ status: 200, description: 'Estado de venta actualizado' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  updateStatus(
    @Request() req,
    @Body() dto: UpdateSaleStatusDto,
  ): Promise<[number, Sale[]]> {
    return this.saleService.updateStatus(req.internal_user_id, dto);
  }
}