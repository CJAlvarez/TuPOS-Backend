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
  Req,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ReturnItemsService } from './return-items.service';
import { CreateReturnItemDto } from './dto/create-return-item.dto';
import { UpdateReturnItemDto } from './dto/update-return-item.dto';
import { GetReturnItemsQueryDto } from './dto/get-return-items-query.dto';
import { UpdateReturnItemStatusDto } from './dto/update-return-item-status.dto';
import { VerifyTokenGuard } from 'src/auth/guards/verify-token.guard';
import { VerifyDisabledUserGuard } from 'src/auth/guards/verify-disabled-user.guard';
import { VerifyAdminAdminGuard } from 'src/auth/guards/verify-admin-admin.guard';

@ApiTags('return-items')
@UseGuards(VerifyTokenGuard, VerifyDisabledUserGuard, VerifyAdminAdminGuard)
@Controller('return-items')
export class ReturnItemsController {
  constructor(private readonly returnItemsService: ReturnItemsService) {}

  @ApiOperation({ summary: 'Crear item de devolución' })
  @ApiBody({ type: CreateReturnItemDto })
  @ApiResponse({ status: 201, description: 'Item de devolución creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @Post()
  async create(@Body() dto: CreateReturnItemDto, @Req() req) {
    return this.returnItemsService.create(dto, req.internal_user_id);
  }

  @ApiOperation({ summary: 'Listar items de devolución' })
  @ApiResponse({ status: 200, description: 'Lista paginada de items de devolución' })
  @Get()
  async findAll(@Request() req, @Query() query: GetReturnItemsQueryDto) {
    return this.returnItemsService.findAll(query);
  }

  @ApiOperation({ summary: 'Obtener item de devolución por ID' })
  @ApiResponse({ status: 200, description: 'Item de devolución encontrado' })
  @ApiResponse({ status: 404, description: 'Item de devolución no encontrado' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.returnItemsService.findOne(Number(id));
  }

  @ApiOperation({ summary: 'Actualizar item de devolución' })
  @ApiBody({ type: UpdateReturnItemDto })
  @ApiResponse({ status: 200, description: 'Item de devolución actualizado' })
  @ApiResponse({ status: 404, description: 'Item de devolución no encontrado' })
  @Put()
  async update(@Body() dto: UpdateReturnItemDto, @Req() req) {
    return this.returnItemsService.update(dto, req.internal_user_id);
  }

  @ApiOperation({ summary: 'Eliminar item de devolución (soft delete)' })
  @ApiResponse({ status: 200, description: 'Item de devolución eliminado' })
  @ApiResponse({ status: 404, description: 'Item de devolución no encontrado' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string, @Req() req) {
    return this.returnItemsService.remove(req.internal_user_id, Number(id));
  }

  @ApiOperation({ summary: 'Cambiar estado de item de devolución' })
  @ApiBody({ type: UpdateReturnItemStatusDto })
  @ApiResponse({ status: 200, description: 'Estado actualizado' })
  @ApiResponse({ status: 404, description: 'Item de devolución no encontrado' })
  @Put('status')
  async updateStatus(@Body() dto: UpdateReturnItemStatusDto, @Req() req) {
    return this.returnItemsService.updateStatus(req.internal_user_id, dto);
  }
}
