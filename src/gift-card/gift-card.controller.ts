import {
  Controller, Get, Post, Body, Param, Delete, UsePipes, ValidationPipe, Request, Put, UseGuards, Query,
} from '@nestjs/common';
import { CreateGiftCardDto } from './dto/create-gift-card.dto';
import { UpdateGiftCardDto } from './dto/update-gift-card.dto';
import { GetGiftCardsQueryDto } from './dto/get-gift-cards-query.dto';
import { UpdateGiftCardStatusDto } from './dto/update-gift-card-status.dto';
import { ApiTags, ApiResponse, ApiOperation, ApiBody } from '@nestjs/swagger';
import { GiftCard } from '../entities/gift-card.entity';
import { GiftCardService } from './gift-card.service';
import { VerifyTokenGuard } from 'src/auth/guards/verify-token.guard';
import { VerifyDisabledUserGuard } from 'src/auth/guards/verify-disabled-user.guard';
import { VerifyAdminAdminGuard } from 'src/auth/guards/verify-admin-admin.guard';

@ApiTags('gift-cards')
@Controller('gift-cards')
@UseGuards(VerifyTokenGuard, VerifyDisabledUserGuard, VerifyAdminAdminGuard)
export class GiftCardController {
  constructor(private readonly giftCardService: GiftCardService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las gift cards (paginado y búsqueda)' })
  @ApiResponse({ status: 200, description: 'Lista de gift cards paginada', type: Object })
  findAll(@Request() req, @Query() query: GetGiftCardsQueryDto): Promise<any> {
    return this.giftCardService.findAll(query, req.internal_store_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una gift card por ID' })
  @ApiResponse({ status: 200, description: 'Gift card encontrada', type: GiftCard })
  @ApiResponse({ status: 404, description: 'Gift card no encontrada' })
  findOne(@Param('id') id: string): Promise<GiftCard | null> {
    return this.giftCardService.findOne(Number(id));
  }

  @Post()
  @ApiOperation({ summary: 'Crear una gift card' })
  @ApiResponse({ status: 201, description: 'Gift card creada', type: GiftCard })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  create(@Request() req, @Body() data: CreateGiftCardDto): Promise<GiftCard> {
    return this.giftCardService.create(req.internal_user_id, req.internal_store_id, data);
  }

  @Put()
  @ApiOperation({ summary: 'Actualizar una gift card' })
  @ApiResponse({ status: 200, description: 'Gift card actualizada', type: GiftCard })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  update(@Body() dto: UpdateGiftCardDto): Promise<[number, GiftCard[]]> {
    return this.giftCardService.update(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una gift card (soft delete)' })
  @ApiResponse({ status: 200, description: 'Gift card eliminada' })
  remove(@Request() req, @Param('id') id: string): Promise<number> {
    return this.giftCardService.remove(req.internal_user_id, Number(id));
  }

  @Put('status')
  @ApiOperation({ summary: 'Habilitar o deshabilitar gift card' })
  @ApiBody({ type: UpdateGiftCardStatusDto })
  @ApiResponse({ status: 200, description: 'Estado de gift card actualizado' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  updateStatus(
    @Request() req,
    @Body() dto: UpdateGiftCardStatusDto,
  ): Promise<[number, GiftCard[]]> {
    return this.giftCardService.updateStatus(req.internal_user_id, dto);
  }
}