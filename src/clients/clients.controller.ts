import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  Put,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { GetClientsQueryDto } from './dto/get-clients-query.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { UpdateClientStatusDto } from './dto/update-client-status.dto';
import { VerifyAdminAdminGuard } from '../auth/guards/verify-admin-admin.guard';
import { VerifyDisabledUserGuard } from '../auth/guards/verify-disabled-user.guard';
import { VerifyTokenGuard } from 'src/auth/guards/verify-token.guard';

@ApiTags('clients')
@Controller('clients')
@UseGuards(VerifyTokenGuard, VerifyDisabledUserGuard, VerifyAdminAdminGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener lista de clientes' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de clientes' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async getClients(@Request() req, @Query() query: GetClientsQueryDto) {
    return this.clientsService.getClients(query, req.internal_store_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de cliente' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Detalle de cliente' })
  async getClientDetail(@Param('id', ParseIntPipe) id: number) {
    return this.clientsService.getClientDetail(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear cliente' })
  @ApiBody({ type: CreateClientDto })
  @ApiResponse({ status: 201, description: 'Cliente creado' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async insertClient(@Request() req, @Body() createClientDto: CreateClientDto) {
    return this.clientsService.insertClient(createClientDto, req.internal_store_id, req.internal_user_id);
  }

  @Put()
  @ApiOperation({ summary: 'Actualizar cliente' })
  @ApiBody({ type: UpdateClientDto })
  @ApiResponse({ status: 200, description: 'Cliente actualizado' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateClient(@Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.updateClient(updateClientDto);
  }

  @Put('status')
  @ApiOperation({ summary: 'Habilitar o deshabilitar cliente' })
  @ApiBody({ type: UpdateClientStatusDto })
  @ApiResponse({ status: 200, description: 'Estado de cliente actualizado' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateClientStatus(
    @Request() req,
    @Body() body: UpdateClientStatusDto,
  ) {
    return this.clientsService.updateClientStatus(req.internal_user_id, body);
  }
}
