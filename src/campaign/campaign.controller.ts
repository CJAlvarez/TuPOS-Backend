import {
  Controller, Get, Post, Body, Param, Delete, UsePipes, ValidationPipe, Request, Put, UseGuards, Query,
} from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { GetCampaignsQueryDto } from './dto/get-campaigns-query.dto';
import { UpdateCampaignStatusDto } from './dto/update-campaign-status.dto';
import { ApiTags, ApiResponse, ApiOperation, ApiBody } from '@nestjs/swagger';
import { Campaign } from '../entities/campaign.entity';
import { CampaignService } from './campaign.service';
import { VerifyTokenGuard } from 'src/auth/guards/verify-token.guard';
import { VerifyDisabledUserGuard } from 'src/auth/guards/verify-disabled-user.guard';
import { VerifyAdminAdminGuard } from 'src/auth/guards/verify-admin-admin.guard';

@ApiTags('campaigns')
@Controller('campaigns')
@UseGuards(VerifyTokenGuard, VerifyDisabledUserGuard, VerifyAdminAdminGuard)
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las campañas (paginado y búsqueda)' })
  @ApiResponse({ status: 200, description: 'Lista de campañas paginada', type: Object })
  findAll(@Request() req, @Query() query: GetCampaignsQueryDto): Promise<any> {
    return this.campaignService.findAll(query, req.internal_store_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una campaña por ID' })
  @ApiResponse({ status: 200, description: 'Campaña encontrada', type: Campaign })
  @ApiResponse({ status: 404, description: 'Campaña no encontrada' })
  findOne(@Param('id') id: string): Promise<Campaign | null> {
    return this.campaignService.findOne(Number(id));
  }

  @Post()
  @ApiOperation({ summary: 'Crear una campaña' })
  @ApiResponse({ status: 201, description: 'Campaña creada', type: Campaign })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  create(@Request() req, @Body() data: CreateCampaignDto): Promise<Campaign> {
    return this.campaignService.create(req.internal_user_id, req.internal_store_id, data);
  }

  @Put()
  @ApiOperation({ summary: 'Actualizar una campaña' })
  @ApiResponse({ status: 200, description: 'Campaña actualizada', type: Campaign })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  update(@Body() dto: UpdateCampaignDto): Promise<[number, Campaign[]]> {
    return this.campaignService.update(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una campaña (soft delete)' })
  @ApiResponse({ status: 200, description: 'Campaña eliminada' })
  remove(@Request() req, @Param('id') id: string): Promise<number> {
    return this.campaignService.remove(req.internal_user_id, Number(id));
  }

  @Put('status')
  @ApiOperation({ summary: 'Habilitar o deshabilitar campaña' })
  @ApiBody({ type: UpdateCampaignStatusDto })
  @ApiResponse({ status: 200, description: 'Estado de campaña actualizado' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  updateStatus(
    @Request() req,
    @Body() dto: UpdateCampaignStatusDto,
  ): Promise<[number, Campaign[]]> {
    return this.campaignService.updateStatus(req.internal_user_id, dto);
  }
}