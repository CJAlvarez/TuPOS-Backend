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

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateProductStatusDto } from './dto/update-product-status.dto';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { Product } from 'src/entities/product.entity';
import { ProductsService } from './products.service';
import { VerifyTokenGuard } from 'src/auth/guards/verify-token.guard';
import { VerifyDisabledUserGuard } from 'src/auth/guards/verify-disabled-user.guard';
import { VerifyAdminAdminGuard } from 'src/auth/guards/verify-admin-admin.guard';
import { GetProductsQueryDto } from './dto/get-products-query.dto';

@ApiTags('products')
@Controller('products')
@UseGuards(VerifyTokenGuard, VerifyDisabledUserGuard, VerifyAdminAdminGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener lista de Productos' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de Productos' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async getProducts(@Request() req, @Query() query: GetProductsQueryDto) {
    return this.productsService.findAll(query, req.internal_store_id);
  }

  @Get('pos')
  @ApiOperation({ summary: 'Obtener lista de Productos para POS' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Lista de Productos para POS' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async getProductsPOS(@Request() req, @Query() query: GetProductsQueryDto) {
    return this.productsService.getProductsPOS(query, req.internal_store_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiResponse({
    status: 200,
    description: 'Producto encontrado',
    type: Product,
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  findOne(@Param('id') id: string): Promise<Product | null> {
    return this.productsService.findOne(Number(id));
  }

  @Post()
  @ApiOperation({ summary: 'Crear un producto' })
  @ApiResponse({ status: 201, description: 'Producto creado', type: Product })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  create(@Request() req, @Body() data: CreateProductDto): Promise<Product> {
    return this.productsService.create(req.internal_user_id, req.internal_store_id, data);
  }

  @Put()
  @ApiOperation({ summary: 'Actualizar un producto' })
  @ApiResponse({
    status: 200,
    description: 'Producto actualizado',
    type: Product,
  })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  update(@Body() dto: UpdateProductDto): Promise<[number, Product[]]> {
    return this.productsService.update(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiResponse({ status: 200, description: 'Producto eliminado' })
  remove(@Request() req, @Param('id') id: string): Promise<number> {
    return this.productsService.remove(req.internal_user_id, Number(id));
  }

  @Put('status')
  @ApiOperation({ summary: 'Habilitar o deshabilitar producto' })
  @ApiBody({ type: UpdateProductStatusDto })
  @ApiResponse({ status: 200, description: 'Estado de producto actualizado' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  updateStatus(
    @Request() req,
    @Body() dto: UpdateProductStatusDto,
  ): Promise<[number, Product[]]> {
    return this.productsService.updateStatus(req.internal_user_id, dto);
  }
}
