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
import { ReturnsService } from './returns.service';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';
import { GetReturnsQueryDto } from './dto/get-returns-query.dto';
import { UpdateReturnStatusDto } from './dto/update-return-status.dto';
import { VerifyTokenGuard } from 'src/auth/guards/verify-token.guard';
import { VerifyDisabledUserGuard } from 'src/auth/guards/verify-disabled-user.guard';
import { VerifyAdminAdminGuard } from 'src/auth/guards/verify-admin-admin.guard';
import { GetProductsQueryDto } from './dto/get-products-query.dto';

@ApiTags('returns')
@UseGuards(VerifyTokenGuard, VerifyDisabledUserGuard, VerifyAdminAdminGuard)
@Controller('returns')
export class ReturnsController {
  constructor(private readonly returnsService: ReturnsService) {}

  @ApiOperation({ summary: 'Crear devolución' })
  @ApiBody({ type: CreateReturnDto })
  @ApiResponse({ status: 201, description: 'Devolución creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @Post()
  async create(@Body() dto: CreateReturnDto, @Req() req) {
    return this.returnsService.create(dto, req.internal_user_id, req.internal_store_id);
  }

  @ApiOperation({ summary: 'Listar devoluciones' })
  @ApiResponse({ status: 200, description: 'Lista paginada de devoluciones' })
  @Get()
  async findAll(@Request() req, @Query() query: GetReturnsQueryDto) {
    return this.returnsService.findAll(query, req.internal_store_id);
  }

  @ApiOperation({ summary: 'Listar productos de devolución' })
  @ApiResponse({ status: 200, description: 'Lista de productos de devolución' })
  @Get('products')
  async getProducts(@Query() query: GetProductsQueryDto) {
    return this.returnsService.getProducts(query);
  }

  @ApiOperation({ summary: 'Obtener devolución por ID' })
  @ApiResponse({ status: 200, description: 'Devolución encontrada' })
  @ApiResponse({ status: 404, description: 'Devolución no encontrada' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.returnsService.findOne(Number(id));
  }

  @ApiOperation({ summary: 'Actualizar devolución' })
  @ApiBody({ type: UpdateReturnDto })
  @ApiResponse({ status: 200, description: 'Devolución actualizada' })
  @ApiResponse({ status: 404, description: 'Devolución no encontrada' })
  @Put()
  async update(@Body() dto: UpdateReturnDto, @Req() req) {
    return this.returnsService.update(dto, req.internal_user_id);
  }

  @ApiOperation({ summary: 'Eliminar devolución (soft delete)' })
  @ApiResponse({ status: 200, description: 'Devolución eliminada' })
  @ApiResponse({ status: 404, description: 'Devolución no encontrada' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string, @Req() req) {
    return this.returnsService.remove(req.internal_user_id, Number(id));
  }

  @ApiOperation({ summary: 'Cambiar estado de devolución' })
  @ApiBody({ type: UpdateReturnStatusDto })
  @ApiResponse({ status: 200, description: 'Estado actualizado' })
  @ApiResponse({ status: 404, description: 'Devolución no encontrada' })
  @Put('status')
  async updateStatus(@Body() dto: UpdateReturnStatusDto, @Req() req) {
    return this.returnsService.updateStatus(req.internal_user_id, dto);
  }
}
