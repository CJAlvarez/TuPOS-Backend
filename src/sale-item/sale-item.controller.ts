import {
  Controller, Get, Post, Body, Param, Delete, UsePipes, ValidationPipe, Request, Put, UseGuards, Query,
} from '@nestjs/common';
import { CreateSaleItemDto } from './dto/create-sale-item.dto';
import { UpdateSaleItemDto } from './dto/update-sale-item.dto';
import { GetSaleItemsQueryDto } from './dto/get-sale-items-query.dto';
import { UpdateSaleItemStatusDto } from './dto/update-sale-item-status.dto';
import { ApiTags, ApiResponse, ApiOperation, ApiBody } from '@nestjs/swagger';
import { SaleItem } from '../entities/sale-item.entity';
import { SaleItemService } from './sale-item.service';
import { VerifyTokenGuard } from 'src/auth/guards/verify-token.guard';
import { VerifyDisabledUserGuard } from 'src/auth/guards/verify-disabled-user.guard';
import { VerifyAdminAdminGuard } from 'src/auth/guards/verify-admin-admin.guard';

@ApiTags('sale-items')
@Controller('sale-items')
@UseGuards(VerifyTokenGuard, VerifyDisabledUserGuard, VerifyAdminAdminGuard)
export class SaleItemController {
  constructor(private readonly saleItemService: SaleItemService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los items de venta (paginado y búsqueda)' })
  @ApiResponse({ status: 200, description: 'Lista de items de venta paginada', type: Object })
  findAll(@Request() req, @Query() query: GetSaleItemsQueryDto): Promise<any> {
    return this.saleItemService.findAll(query, req.internal_store_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un item de venta por ID' })
  @ApiResponse({ status: 200, description: 'Item de venta encontrado', type: SaleItem })
  @ApiResponse({ status: 404, description: 'Item de venta no encontrado' })
  findOne(@Param('id') id: string): Promise<SaleItem | null> {
    return this.saleItemService.findOne(Number(id));
  }

  @Post()
  @ApiOperation({ summary: 'Crear un item de venta' })
  @ApiResponse({ status: 201, description: 'Item de venta creado', type: SaleItem })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  create(@Request() req, @Body() data: CreateSaleItemDto): Promise<SaleItem> {
    return this.saleItemService.create(req.internal_user_id, req.internal_store_id, data);
  }

  @Put()
  @ApiOperation({ summary: 'Actualizar un item de venta' })
  @ApiResponse({ status: 200, description: 'Item de venta actualizado', type: SaleItem })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  update(@Body() dto: UpdateSaleItemDto): Promise<[number, SaleItem[]]> {
    return this.saleItemService.update(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un item de venta (soft delete)' })
  @ApiResponse({ status: 200, description: 'Item de venta eliminado' })
  remove(@Request() req, @Param('id') id: string): Promise<number> {
    return this.saleItemService.remove(req.internal_user_id, Number(id));
  }

  @Put('status')
  @ApiOperation({ summary: 'Habilitar o deshabilitar item de venta' })
  @ApiBody({ type: UpdateSaleItemStatusDto })
  @ApiResponse({ status: 200, description: 'Estado de item de venta actualizado' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  updateStatus(
    @Request() req,
    @Body() dto: UpdateSaleItemStatusDto,
  ): Promise<[number, SaleItem[]]> {
    return this.saleItemService.updateStatus(req.internal_user_id, dto);
  }
}