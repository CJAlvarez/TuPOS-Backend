import {
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { VerifyTokenGuard } from '../auth/guards/verify-token.guard';
import { VerifyDisabledUserGuard } from '../auth/guards/verify-disabled-user.guard';
import { VerifyAdminAdminGuard } from '../auth/guards/verify-admin-admin.guard';
import {
  DailySalesRequestDto,
  DailySalesResponseDto,
} from './dto/daily-sales-reports.dto';
import { InventoryLowRequestDto, InventoryLowResponseDto } from './dto/inventory-low-reports.dto';
import { InventoryExpiringRequestDto, InventoryExpiringResponseDto } from './dto/inventory-expiring-reports.dto';

@ApiTags('reports')
@Controller('reports')
@UseGuards(VerifyTokenGuard, VerifyDisabledUserGuard, VerifyAdminAdminGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // Reportes de Ventas Diarias
  @Get('daily-sales')
  @ApiOperation({
    summary: 'Obtener ventas del día',
    description: 'Reporte de cálculo inmediato',
  })
  @ApiResponse({
    status: 200,
    description: 'Ventas del día obtenidas exitosamente',
    type: DailySalesResponseDto,
  })
  async getDailySales(
    @Request() req,
    @Query() dto: DailySalesRequestDto,
  ): Promise<DailySalesResponseDto> {
    return await this.reportsService.getDailySales(dto, req.internal_store_id);
  }

  // Reportes de Inventario Bajo
  @Get('inventory-low')
  @ApiOperation({
    summary: 'Obtener inventario bajo',
    description: 'Reporte de cálculo inmediato',
  })
  @ApiResponse({
    status: 200,
    description: 'Inventario bajo obtenido exitosamente',
    type: InventoryLowResponseDto,
  })
  async getInventoryLow(
    @Request() req,
    @Query() dto: InventoryLowRequestDto,
  ): Promise<InventoryLowResponseDto> {
    return await this.reportsService.getInventoryLow(dto, req.internal_store_id);
  }

  // Reportes de Inventario por Vencer
  @Get('inventory-expiring')
  @ApiOperation({
    summary: 'Obtener inventario por vencer',
    description: 'Reporte de cálculo inmediato',
  })
  @ApiResponse({
    status: 200,
    description: 'Inventario por vencer obtenido exitosamente',
    type: InventoryExpiringResponseDto,
  })
  async getInventoryExpiring(
    @Request() req,
    @Query() dto: InventoryExpiringRequestDto,
  ): Promise<InventoryExpiringResponseDto> {
    return await this.reportsService.getInventoryExpiring(dto, req.internal_store_id);
  }
}
