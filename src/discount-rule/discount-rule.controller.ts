import {
  Controller, Get, Post, Body, Param, Delete, UsePipes, ValidationPipe, Request, Put, UseGuards, Query,
} from '@nestjs/common';
import { CreateDiscountRuleDto } from './dto/create-discount-rule.dto';
import { UpdateDiscountRuleDto } from './dto/update-discount-rule.dto';
import { GetDiscountRulesQueryDto } from './dto/get-discount-rules-query.dto';
import { UpdateDiscountRuleStatusDto } from './dto/update-discount-rule-status.dto';
import { ApiTags, ApiResponse, ApiOperation, ApiBody } from '@nestjs/swagger';
import { DiscountRule } from '../entities/discount-rule.entity';
import { DiscountRuleService } from './discount-rule.service';
import { VerifyTokenGuard } from 'src/auth/guards/verify-token.guard';
import { VerifyDisabledUserGuard } from 'src/auth/guards/verify-disabled-user.guard';
import { VerifyAdminAdminGuard } from 'src/auth/guards/verify-admin-admin.guard';

@ApiTags('discount-rules')
@Controller('discount-rules')
@UseGuards(VerifyTokenGuard, VerifyDisabledUserGuard, VerifyAdminAdminGuard)
export class DiscountRuleController {
  constructor(private readonly discountRuleService: DiscountRuleService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las reglas de descuento (paginado y búsqueda)' })
  @ApiResponse({ status: 200, description: 'Lista de reglas de descuento paginada', type: Object })
  findAll(@Request() req, @Query() query: GetDiscountRulesQueryDto): Promise<any> {
    return this.discountRuleService.findAll(query, req.internal_store_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una regla de descuento por ID' })
  @ApiResponse({ status: 200, description: 'Regla de descuento encontrada', type: DiscountRule })
  @ApiResponse({ status: 404, description: 'Regla de descuento no encontrada' })
  findOne(@Param('id') id: string): Promise<DiscountRule | null> {
    return this.discountRuleService.findOne(Number(id));
  }

  @Post()
  @ApiOperation({ summary: 'Crear una regla de descuento' })
  @ApiResponse({ status: 201, description: 'Regla de descuento creada', type: DiscountRule })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  create(@Request() req, @Body() data: CreateDiscountRuleDto): Promise<DiscountRule> {
    return this.discountRuleService.create(req.internal_user_id, req.internal_store_id, data);
  }

  @Put()
  @ApiOperation({ summary: 'Actualizar una regla de descuento' })
  @ApiResponse({ status: 200, description: 'Regla de descuento actualizada', type: DiscountRule })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  update(@Body() dto: UpdateDiscountRuleDto): Promise<[number, DiscountRule[]]> {
    return this.discountRuleService.update(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una regla de descuento (soft delete)' })
  @ApiResponse({ status: 200, description: 'Regla de descuento eliminada' })
  remove(@Request() req, @Param('id') id: string): Promise<number> {
    return this.discountRuleService.remove(req.internal_user_id, Number(id));
  }

  @Put('status')
  @ApiOperation({ summary: 'Habilitar o deshabilitar regla de descuento' })
  @ApiBody({ type: UpdateDiscountRuleStatusDto })
  @ApiResponse({ status: 200, description: 'Estado de regla de descuento actualizado' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  updateStatus(
    @Request() req,
    @Body() dto: UpdateDiscountRuleStatusDto,
  ): Promise<[number, DiscountRule[]]> {
    return this.discountRuleService.updateStatus(req.internal_user_id, dto);
  }
}