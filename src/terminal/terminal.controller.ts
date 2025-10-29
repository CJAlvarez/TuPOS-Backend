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
import { CreateTerminalDto } from './dto/create-terminal.dto';
import { UpdateTerminalDto } from './dto/update-terminal.dto';
import { GetTerminalsQueryDto } from './dto/get-terminals-query.dto';
import { UpdateTerminalStatusDto } from './dto/update-terminal-status.dto';
import { ApiTags, ApiResponse, ApiOperation, ApiBody } from '@nestjs/swagger';
import { Terminal } from 'src/entities/terminal.entity';
import { TerminalService } from './terminal.service';
import { VerifyTokenGuard } from 'src/auth/guards/verify-token.guard';
import { VerifyDisabledUserGuard } from 'src/auth/guards/verify-disabled-user.guard';
import { VerifyAdminAdminGuard } from 'src/auth/guards/verify-admin-admin.guard';

@ApiTags('terminals')
@Controller('terminals')
@UseGuards(VerifyTokenGuard, VerifyDisabledUserGuard, VerifyAdminAdminGuard)
export class TerminalController {
  constructor(private readonly terminalService: TerminalService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los terminales (paginado y búsqueda)' })
  @ApiResponse({ status: 200, description: 'Lista de terminales paginada', type: Object })
  findAll(@Request() req, @Query() query: GetTerminalsQueryDto): Promise<any> {
    return this.terminalService.findAll(query, req.internal_store_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un terminal por ID' })
  @ApiResponse({ status: 200, description: 'Terminal encontrado', type: Terminal })
  @ApiResponse({ status: 404, description: 'Terminal no encontrado' })
  findOne(@Param('id') id: string): Promise<Terminal | null> {
    return this.terminalService.findOne(Number(id));
  }

  @Post()
  @ApiOperation({ summary: 'Crear un terminal' })
  @ApiResponse({ status: 201, description: 'Terminal creado', type: Terminal })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  create(@Request() req, @Body() data: CreateTerminalDto): Promise<Terminal> {
    return this.terminalService.create(req.internal_user_id, req.internal_store_id, data);
  }

  @Put()
  @ApiOperation({ summary: 'Actualizar un terminal' })
  @ApiResponse({ status: 200, description: 'Terminal actualizado', type: Terminal })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  update(@Body() dto: UpdateTerminalDto): Promise<[number, Terminal[]]> {
    return this.terminalService.update(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un terminal (soft delete)' })
  @ApiResponse({ status: 200, description: 'Terminal eliminado' })
  remove(@Request() req, @Param('id') id: string): Promise<number> {
    return this.terminalService.remove(req.internal_user_id, Number(id));
  }

  @Put('status')
  @ApiOperation({ summary: 'Habilitar o deshabilitar terminal' })
  @ApiBody({ type: UpdateTerminalStatusDto })
  @ApiResponse({ status: 200, description: 'Estado de terminal actualizado' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  updateStatus(
    @Request() req,
    @Body() dto: UpdateTerminalStatusDto,
  ): Promise<[number, Terminal[]]> {
    return this.terminalService.updateStatus(req.internal_user_id, dto);
  }
}
