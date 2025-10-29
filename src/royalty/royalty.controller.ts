import {
  Controller, Get, Post, Body, Param, Delete, UsePipes, ValidationPipe, Request, Put, UseGuards, Query,
} from '@nestjs/common';
import { CreateRoyaltyDto } from './dto/create-royalty.dto';
import { UpdateRoyaltyDto } from './dto/update-royalty.dto';
import { GetRoyaltiesQueryDto } from './dto/get-royalties-query.dto';
import { UpdateRoyaltyStatusDto } from './dto/update-royalty-status.dto';
import { ApiTags, ApiResponse, ApiOperation, ApiBody } from '@nestjs/swagger';
import { Royalty } from '../entities/royalty.entity';
import { RoyaltyService } from './royalty.service';
import { VerifyTokenGuard } from 'src/auth/guards/verify-token.guard';
import { VerifyDisabledUserGuard } from 'src/auth/guards/verify-disabled-user.guard';
import { VerifyAdminAdminGuard } from 'src/auth/guards/verify-admin-admin.guard';

@ApiTags('royalties')
@Controller('royalties')
@UseGuards(VerifyTokenGuard, VerifyDisabledUserGuard, VerifyAdminAdminGuard)
export class RoyaltyController {
  constructor(private readonly royaltyService: RoyaltyService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los registros de lealtad (paginado y búsqueda)' })
  @ApiResponse({ status: 200, description: 'Lista de registros de lealtad paginada', type: Object })
  findAll(@Request() req, @Query() query: GetRoyaltiesQueryDto): Promise<any> {
    return this.royaltyService.findAll(query, req.internal_store_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una lealtad por ID' })
  @ApiResponse({ status: 200, description: 'lealtad encontrada', type: Royalty })
  @ApiResponse({ status: 404, description: 'lealtad no encontrada' })
  findOne(@Param('id') id: string): Promise<Royalty | null> {
    return this.royaltyService.findOne(Number(id));
  }

  @Post()
  @ApiOperation({ summary: 'Crear una lealtad' })
  @ApiResponse({ status: 201, description: 'lealtad creada', type: Royalty })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  create(@Request() req, @Body() data: CreateRoyaltyDto): Promise<Royalty> {
    return this.royaltyService.create(req.internal_user_id, req.internal_store_id, data);
  }

  @Put()
  @ApiOperation({ summary: 'Actualizar una lealtad' })
  @ApiResponse({ status: 200, description: 'lealtad actualizada', type: Royalty })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  update(@Body() dto: UpdateRoyaltyDto): Promise<[number, Royalty[]]> {
    return this.royaltyService.update(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una lealtad (soft delete)' })
  @ApiResponse({ status: 200, description: 'lealtad eliminada' })
  remove(@Request() req, @Param('id') id: string): Promise<number> {
    return this.royaltyService.remove(req.internal_user_id, Number(id));
  }

  @Put('status')
  @ApiOperation({ summary: 'Habilitar o deshabilitar lealtad' })
  @ApiBody({ type: UpdateRoyaltyStatusDto })
  @ApiResponse({ status: 200, description: 'Estado de lealtad actualizado' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  updateStatus(
    @Request() req,
    @Body() dto: UpdateRoyaltyStatusDto,
  ): Promise<[number, Royalty[]]> {
    return this.royaltyService.updateStatus(req.internal_user_id, dto);
  }
}