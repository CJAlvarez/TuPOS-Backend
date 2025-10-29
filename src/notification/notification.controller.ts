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
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { GetNotificationsQueryDto } from './dto/get-notifications-query.dto';
import { UpdateNotificationStatusDto } from './dto/update-notification-status.dto';
import { UpdateNotificationSeenDto } from './dto/update-notification-seen.dto';
import { UpdateNotificationArchivedDto } from './dto/update-notification-archived.dto';
import { UpdateNotificationDeletedDto } from './dto/update-notification-deleted.dto';
import { ApiTags, ApiResponse, ApiOperation, ApiBody } from '@nestjs/swagger';
import { Notification } from '../entities/notification.entity';
import { NotificationService } from './notification.service';
import { VerifyTokenGuard } from 'src/auth/guards/verify-token.guard';
import { VerifyDisabledUserGuard } from 'src/auth/guards/verify-disabled-user.guard';
import { VerifyAdminAdminGuard } from 'src/auth/guards/verify-admin-admin.guard';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(VerifyTokenGuard, VerifyDisabledUserGuard, VerifyAdminAdminGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las notificaciones (paginado y búsqueda)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de notificaciones paginada',
    type: Object,
  })
  findAll(@Request() req, @Query() query: GetNotificationsQueryDto): Promise<any> {
    return this.notificationService.findAll(query, req.internal_store_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una notificación por ID' })
  @ApiResponse({
    status: 200,
    description: 'Notificación encontrada',
    type: Notification,
  })
  @ApiResponse({ status: 404, description: 'Notificación no encontrada' })
  findOne(@Param('id') id: string): Promise<Notification | null> {
    return this.notificationService.findOne(Number(id));
  }

  @Post()
  @ApiOperation({ summary: 'Crear una notificación' })
  @ApiResponse({
    status: 201,
    description: 'Notificación creada',
    type: Notification,
  })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  create(
    @Request() req,
    @Body() data: CreateNotificationDto,
  ): Promise<Notification> {
    return this.notificationService.create(req.internal_user_id, req.internal_store_id, data);
  }

  @Put()
  @ApiOperation({ summary: 'Actualizar una notificación' })
  @ApiResponse({
    status: 200,
    description: 'Notificación actualizada',
    type: Notification,
  })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  update(
    @Body() dto: UpdateNotificationDto,
  ): Promise<[number, Notification[]]> {
    return this.notificationService.update(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una notificación (soft delete)' })
  @ApiResponse({ status: 200, description: 'Notificación eliminada' })
  remove(@Request() req, @Param('id') id: string): Promise<number> {
    return this.notificationService.remove(req.internal_user_id, Number(id));
  }

  @Put('status')
  @ApiOperation({ summary: 'Habilitar o deshabilitar notificación' })
  @ApiBody({ type: UpdateNotificationStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Estado de notificación actualizado',
  })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  updateStatus(
    @Request() req,
    @Body() dto: UpdateNotificationStatusDto,
  ): Promise<[number, Notification[]]> {
    return this.notificationService.updateStatus(req.internal_user_id, dto);
  }

  @Put('seen')
  @ApiOperation({ summary: 'Marcar notificación como vista' })
  @ApiBody({ type: UpdateNotificationSeenDto })
  @ApiResponse({ status: 200, description: 'Notificación marcada como vista' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  updateSeen(
    @Request() req,
    @Body() dto: UpdateNotificationSeenDto,
  ): Promise<[number, Notification[]]> {
    return this.notificationService.updateSeen(req.internal_user_id, dto);
  }

  @Put('archive')
  @ApiOperation({ summary: 'Archivar notificación' })
  @ApiBody({ type: UpdateNotificationArchivedDto })
  @ApiResponse({ status: 200, description: 'Notificación archivada' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  updateArchived(
    @Request() req,
    @Body() dto: UpdateNotificationArchivedDto,
  ): Promise<[number, Notification[]]> {
    return this.notificationService.updateArchived(req.internal_user_id, dto);
  }
}
