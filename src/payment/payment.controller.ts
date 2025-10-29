import {
  Controller, Get, Post, Body, Param, Delete, UsePipes, ValidationPipe, Request, Put, UseGuards, Query,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { GetPaymentsQueryDto } from './dto/get-payments-query.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { ApiTags, ApiResponse, ApiOperation, ApiBody } from '@nestjs/swagger';
import { Payment } from '../entities/payment.entity';
import { PaymentService } from './payment.service';
import { VerifyTokenGuard } from 'src/auth/guards/verify-token.guard';
import { VerifyDisabledUserGuard } from 'src/auth/guards/verify-disabled-user.guard';
import { VerifyAdminAdminGuard } from 'src/auth/guards/verify-admin-admin.guard';

@ApiTags('payments')
@Controller('payments')
@UseGuards(VerifyTokenGuard, VerifyDisabledUserGuard, VerifyAdminAdminGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los pagos (paginado y búsqueda)' })
  @ApiResponse({ status: 200, description: 'Lista de pagos paginada', type: Object })
  findAll(@Request() req, @Query() query: GetPaymentsQueryDto): Promise<any> {
    return this.paymentService.findAll(query, req.internal_store_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un pago por ID' })
  @ApiResponse({ status: 200, description: 'Pago encontrado', type: Payment })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  findOne(@Param('id') id: string): Promise<Payment | null> {
    return this.paymentService.findOne(Number(id));
  }

  @Post()
  @ApiOperation({ summary: 'Crear un pago' })
  @ApiResponse({ status: 201, description: 'Pago creado', type: Payment })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  create(@Request() req, @Body() data: CreatePaymentDto): Promise<Payment> {
    return this.paymentService.create(req.internal_user_id, req.internal_store_id, data);
  }

  @Put()
  @ApiOperation({ summary: 'Actualizar un pago' })
  @ApiResponse({ status: 200, description: 'Pago actualizado', type: Payment })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  update(@Body() dto: UpdatePaymentDto): Promise<[number, Payment[]]> {
    return this.paymentService.update(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un pago (soft delete)' })
  @ApiResponse({ status: 200, description: 'Pago eliminado' })
  remove(@Request() req, @Param('id') id: string): Promise<number> {
    return this.paymentService.remove(req.internal_user_id, Number(id));
  }

  @Put('status')
  @ApiOperation({ summary: 'Habilitar o deshabilitar pago' })
  @ApiBody({ type: UpdatePaymentStatusDto })
  @ApiResponse({ status: 200, description: 'Estado de pago actualizado' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  updateStatus(
    @Request() req,
    @Body() dto: UpdatePaymentStatusDto,
  ): Promise<[number, Payment[]]> {
    return this.paymentService.updateStatus(req.internal_user_id, dto);
  }
}