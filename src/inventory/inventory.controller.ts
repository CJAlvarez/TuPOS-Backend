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
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { GetInventoryQueryDto } from './dto/get-inventory-query.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Inventory } from 'src/entities/inventory.entity';
import { InventoryService } from './inventory.service';
import { VerifyTokenGuard } from 'src/auth/guards/verify-token.guard';
import { VerifyDisabledUserGuard } from 'src/auth/guards/verify-disabled-user.guard';
import { VerifyAdminAdminGuard } from 'src/auth/guards/verify-admin-admin.guard';

@ApiTags('inventory')
@Controller('inventory')
@UseGuards(VerifyTokenGuard, VerifyDisabledUserGuard, VerifyAdminAdminGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los registros de inventario (paginado y búsqueda)' })
  @ApiResponse({ status: 200, description: 'Lista de inventario paginada', type: Object })
  findAll(@Request() req, @Query() query: GetInventoryQueryDto): Promise<any> {
    return this.inventoryService.findAll(query, req.internal_store_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un registro de inventario por ID' })
  @ApiResponse({ status: 200, description: 'Inventario encontrado', type: Inventory })
  @ApiResponse({ status: 404, description: 'Inventario no encontrado' })
  findOne(@Param('id') id: string): Promise<Inventory | null> {
    return this.inventoryService.findOne(Number(id));
  }

  @Post()
  @ApiOperation({ summary: 'Crear un registro de inventario' })
  @ApiResponse({ status: 201, description: 'Inventario creado', type: Inventory })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  create(@Request() req, @Body() data: CreateInventoryDto): Promise<Inventory> {
    return this.inventoryService.create(req.internal_user_id, req.internal_store_id, data);
  }

  @Put()
  @ApiOperation({ summary: 'Actualizar un registro de inventario' })
  @ApiResponse({ status: 200, description: 'Inventario actualizado', type: Inventory })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  update(@Body() dto: UpdateInventoryDto): Promise<[number, Inventory[]]> {
    return this.inventoryService.update(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un registro de inventario' })
  @ApiResponse({ status: 200, description: 'Inventario eliminado' })
  remove(@Request() req, @Param('id') id: string): Promise<number> {
    return this.inventoryService.remove(req.internal_user_id, Number(id));
  }
}
