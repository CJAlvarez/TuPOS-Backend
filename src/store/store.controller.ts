import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Request,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { GetStoresQueryDto } from './dto/get-stores-query.dto';
import { UpdateStoreStatusDto } from './dto/update-store-status.dto';
import { ApiTags, ApiResponse, ApiOperation, ApiBody } from '@nestjs/swagger';
import { Store } from 'src/entities/store.entity';
import { StoreService } from './store.service';
import { VerifyTokenGuard } from 'src/auth/guards/verify-token.guard';
import { VerifyDisabledUserGuard } from 'src/auth/guards/verify-disabled-user.guard';
import { VerifyAdminAdminGuard } from 'src/auth/guards/verify-admin-admin.guard';

@ApiTags('stores')
@Controller('stores')
@UseGuards(VerifyTokenGuard, VerifyDisabledUserGuard, VerifyAdminAdminGuard)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las tiendas (paginado y búsqueda)' })
  @ApiResponse({ status: 200, description: 'Lista de tiendas paginada', type: Object })
  findAll(@Request() req, @Query() query: GetStoresQueryDto): Promise<any> {
    return this.storeService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una tienda por ID' })
  @ApiResponse({ status: 200, description: 'Tienda encontrada', type: Store })
  @ApiResponse({ status: 404, description: 'Tienda no encontrada' })
  findOne(@Param('id') id: string): Promise<Store | null> {
    return this.storeService.findOne(Number(id));
  }

  @Post()
  @ApiOperation({ summary: 'Crear una tienda' })
  @ApiResponse({ status: 201, description: 'Tienda creada', type: Store })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  create(@Request() req, @Body() data: CreateStoreDto): Promise<Store> {
    return this.storeService.create(req.internal_user_id, data);
  }

  @Put()
  @ApiOperation({ summary: 'Actualizar una tienda' })
  @ApiResponse({ status: 200, description: 'Tienda actualizada', type: Store })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  update(@Body() dto: UpdateStoreDto): Promise<[number, Store[]]> {
    return this.storeService.update(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una tienda (soft delete)' })
  @ApiResponse({ status: 200, description: 'Tienda eliminada' })
  remove(@Request() req, @Param('id') id: string): Promise<number> {
    return this.storeService.remove(req.internal_user_id, Number(id));
  }

  @Put('status')
  @ApiOperation({ summary: 'Habilitar o deshabilitar tienda' })
  @ApiBody({ type: UpdateStoreStatusDto })
  @ApiResponse({ status: 200, description: 'Estado de tienda actualizado' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  updateStatus(
    @Request() req,
    @Body() dto: UpdateStoreStatusDto,
  ): Promise<[number, Store[]]> {
    return this.storeService.updateStatus(req.internal_user_id, dto);
  }
}
