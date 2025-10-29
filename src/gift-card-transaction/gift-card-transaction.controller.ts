import {
  Controller, Get, Post, Body, Param, Delete, UsePipes, ValidationPipe, Request, Put, UseGuards, Query,
} from '@nestjs/common';
import { CreateGiftCardTransactionDto } from './dto/create-gift-card-transaction.dto';
import { UpdateGiftCardTransactionDto } from './dto/update-gift-card-transaction.dto';
import { GetGiftCardTransactionsQueryDto } from './dto/get-gift-card-transactions-query.dto';
import { UpdateGiftCardTransactionStatusDto } from './dto/update-gift-card-transaction-status.dto';
import { ApiTags, ApiResponse, ApiOperation, ApiBody } from '@nestjs/swagger';
import { GiftCardTransaction } from '../entities/gift-card-transaction.entity';
import { GiftCardTransactionService } from './gift-card-transaction.service';
import { VerifyTokenGuard } from 'src/auth/guards/verify-token.guard';
import { VerifyDisabledUserGuard } from 'src/auth/guards/verify-disabled-user.guard';
import { VerifyAdminAdminGuard } from 'src/auth/guards/verify-admin-admin.guard';

@ApiTags('gift-card-transactions')
@Controller('gift-card-transactions')
@UseGuards(VerifyTokenGuard, VerifyDisabledUserGuard, VerifyAdminAdminGuard)
export class GiftCardTransactionController {
  constructor(private readonly giftCardTransactionService: GiftCardTransactionService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las transacciones de gift card (paginado y búsqueda)' })
  @ApiResponse({ status: 200, description: 'Lista de transacciones paginada', type: Object })
  findAll(@Request() req, @Query() query: GetGiftCardTransactionsQueryDto): Promise<any> {
    return this.giftCardTransactionService.findAll(query, req.internal_store_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una transacción de gift card por ID' })
  @ApiResponse({ status: 200, description: 'Transacción encontrada', type: GiftCardTransaction })
  @ApiResponse({ status: 404, description: 'Transacción no encontrada' })
  findOne(@Param('id') id: string): Promise<GiftCardTransaction | null> {
    return this.giftCardTransactionService.findOne(Number(id));
  }

  @Post()
  @ApiOperation({ summary: 'Crear una transacción de gift card' })
  @ApiResponse({ status: 201, description: 'Transacción creada', type: GiftCardTransaction })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  create(@Request() req, @Body() data: CreateGiftCardTransactionDto): Promise<GiftCardTransaction> {
    return this.giftCardTransactionService.create(req.internal_user_id, req.internal_store_id, data);
  }

  @Put()
  @ApiOperation({ summary: 'Actualizar una transacción de gift card' })
  @ApiResponse({ status: 200, description: 'Transacción actualizada', type: GiftCardTransaction })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  update(@Body() dto: UpdateGiftCardTransactionDto): Promise<[number, GiftCardTransaction[]]> {
    return this.giftCardTransactionService.update(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una transacción de gift card (soft delete)' })
  @ApiResponse({ status: 200, description: 'Transacción eliminada' })
  remove(@Request() req, @Param('id') id: string): Promise<number> {
    return this.giftCardTransactionService.remove(req.internal_user_id, Number(id));
  }

  @Put('status')
  @ApiOperation({ summary: 'Habilitar o deshabilitar transacción de gift card' })
  @ApiBody({ type: UpdateGiftCardTransactionStatusDto })
  @ApiResponse({ status: 200, description: 'Estado de transacción actualizado' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  updateStatus(
    @Request() req,
    @Body() dto: UpdateGiftCardTransactionStatusDto,
  ): Promise<[number, GiftCardTransaction[]]> {
    return this.giftCardTransactionService.updateStatus(req.internal_user_id, dto);
  }
}