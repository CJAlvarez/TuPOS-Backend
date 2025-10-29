import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CatalogsService } from './catalogs.service';
import { VerifyTokenGuard } from 'src/auth/guards/verify-token.guard';
import { VerifyDisabledUserGuard } from 'src/auth/guards/verify-disabled-user.guard';
import { VerifyAdminAdminGuard } from 'src/auth/guards/verify-admin-admin.guard';

@ApiTags('catalogs')
@Controller('catalogs')
export class CatalogsController {
  constructor(private readonly catalogsService: CatalogsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener catálogos generales' })
  @ApiQuery({
    name: 'catalogs',
    required: true,
    type: Array<String>,
    description: 'Catálogos a consultar',
  })
  @ApiResponse({ status: 200, description: 'Lista de catálogos' })
  getCatalogs(@Query() query: any) {
    return this.catalogsService.getCatalogs(query);
  }

  @Get('version')
  @ApiOperation({ summary: 'Obtener versión actual de los catálogos' })
  @ApiResponse({ status: 200, description: 'Versión actual de los catálogos' })
  getCatalogsVersion() {
    return this.catalogsService.getCatalogsVersion();
  }

  @Get('update-version')
  @ApiOperation({ summary: 'Actualizar la versión de un catálogo' })
  @ApiQuery({
    name: 'key',
    required: true,
    type: String,
    description: 'Nombre del catálogo',
  })
  @ApiQuery({
    name: 'date',
    required: false,
    type: String,
    description: 'Fecha de la versión (ISO)',
  })
  @ApiResponse({ status: 200, description: 'Versión actualizada' })
  async updateCatalogVersion(
    @Query('key') key: string,
    @Query('date') date?: string,
  ) {
    const versionDate = date ? new Date(date) : new Date();
    await this.catalogsService.updateCatalogVersion(key, versionDate);
    return { key, catalog_version: versionDate.toISOString() };
  }

  @Get('clients')
  @ApiOperation({ summary: 'Obtener clientes por search_word' })
  @ApiQuery({
    name: 'search_word',
    required: true,
    type: String,
    description: 'Palabra a buscar',
  })
  @ApiResponse({ status: 200, description: 'Lista de clientes' })
  @UseGuards(VerifyTokenGuard, VerifyDisabledUserGuard, VerifyAdminAdminGuard)
  async getClients(@Query('search_word') search_word: string) {
    return this.catalogsService.getClients(search_word);
  }
}
