import {
  Controller, Get, Post, Body, Param, Delete, UsePipes, ValidationPipe, Request, Put, UseGuards, Query,
} from '@nestjs/common';
import { CreateCashboxDto } from './dto/create-cashbox.dto';
import { UpdateCashboxDto } from './dto/update-cashbox.dto';
import { GetCashboxesQueryDto } from './dto/get-cashboxes-query.dto';
import { UpdateCashboxStatusDto } from './dto/update-cashbox-status.dto';
import { ApiTags, ApiResponse, ApiOperation, ApiBody } from '@nestjs/swagger';
import { OpenCashboxDto } from './dto/open-cashbox.dto';
import { CloseCashboxDto } from './dto/close-cashbox.dto';
import { Cashbox } from '../entities/cashbox.entity';
import { CashboxService } from './cashbox.service';
import { VerifyTokenGuard } from 'src/auth/guards/verify-token.guard';
import { VerifyDisabledUserGuard } from 'src/auth/guards/verify-disabled-user.guard';
import { VerifyAdminAdminGuard } from 'src/auth/guards/verify-admin-admin.guard';

@ApiTags('cashboxes')
@Controller('cashboxes')
@UseGuards(VerifyTokenGuard, VerifyDisabledUserGuard, VerifyAdminAdminGuard)
export class CashboxController {
  constructor(private readonly cashboxService: CashboxService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las cajas (paginado y búsqueda)' })
  @ApiResponse({ status: 200, description: 'Lista de cajas paginada', type: Object })
  findAll(@Request() req, @Query() query: GetCashboxesQueryDto): Promise<any> {
    return this.cashboxService.findAll(query, req.internal_store_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una caja por ID' })
  @ApiResponse({ status: 200, description: 'Caja encontrada', type: Cashbox })
  @ApiResponse({ status: 404, description: 'Caja no encontrada' })
  findOne(@Param('id') id: string): Promise<Cashbox | null> {
    return this.cashboxService.findOne(Number(id));
  }

  @Post()
  @ApiOperation({ summary: 'Crear una caja' })
  @ApiResponse({ status: 201, description: 'Caja creada', type: Cashbox })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  create(@Request() req, @Body() data: CreateCashboxDto): Promise<Cashbox> {
    return this.cashboxService.create(req.internal_user_id, req.internal_store_id, data);
  }

  @Put()
  @ApiOperation({ summary: 'Actualizar una caja' })
  @ApiResponse({ status: 200, description: 'Caja actualizada', type: Cashbox })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  update(@Body() dto: UpdateCashboxDto): Promise<[number, Cashbox[]]> {
    return this.cashboxService.update(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una caja (soft delete)' })
  @ApiResponse({ status: 200, description: 'Caja eliminada' })
  remove(@Request() req, @Param('id') id: string): Promise<number> {
    return this.cashboxService.remove(req.internal_user_id, Number(id));
  }

  @Put('status')
  @ApiOperation({ summary: 'Habilitar o deshabilitar caja' })
  @ApiBody({ type: UpdateCashboxStatusDto })
  @ApiResponse({ status: 200, description: 'Estado de caja actualizado' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  updateStatus(
    @Request() req,
    @Body() dto: UpdateCashboxStatusDto,
  ): Promise<[number, Cashbox[]]> {
    return this.cashboxService.updateStatus(req.internal_user_id, dto);
  }

  @Put('open')
  @ApiOperation({ summary: 'Abrir caja' })
  @ApiBody({ type: OpenCashboxDto })
  @ApiResponse({ status: 200, description: 'Caja abierta' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  openCashbox(
    @Request() req,
    @Body() dto: OpenCashboxDto,
  ): Promise<[number, Cashbox[]]> {
    return this.cashboxService.openCashbox(req.internal_user_id, dto);
  }

  @Put('close')
  @ApiOperation({ summary: 'Cerrar caja' })
  @ApiBody({ type: CloseCashboxDto })
  @ApiResponse({ status: 200, description: 'Caja cerrada' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  closeCashbox(
    @Request() req,
    @Body() dto: CloseCashboxDto,
  ): Promise<[number, Cashbox[]]> {
    return this.cashboxService.closeCashbox(req.internal_user_id, dto);
  }
}