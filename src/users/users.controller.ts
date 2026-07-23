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
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EnableUserDto } from './dto/enable-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { User } from '../entities/user.entity';
import { VerifyAdminAdminGuard } from '../auth/guards/verify-admin-admin.guard';
import { VerifyDisabledUserGuard } from '../auth/guards/verify-disabled-user.guard';
import { VerifyTokenGuard } from 'src/auth/guards/verify-token.guard';

@ApiTags('users')
@Controller('users')
@UseGuards(VerifyTokenGuard, VerifyDisabledUserGuard, VerifyAdminAdminGuard)
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener lista de administradores' })
  @ApiResponse({
    status: 200,
    schema: { example: { count: 100, list: [], skip: 0 } },
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  findAll(@Request() req, @Query() query: GetUsersQueryDto) {
    return this.service.findAll(query);
  }

  @Post()
  @ApiOperation({ summary: 'Crear administrador' })
  @ApiResponse({ status: 201, type: User })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  create(@Request() req, @Body() dto: CreateUserDto) {
    return this.service.create(req.internal_user_id, dto);
  }

  @Put()
  @ApiOperation({ summary: 'Actualizar administrador' })
  @ApiResponse({ status: 200, type: User })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  update(@Request() req, @Body() dto: UpdateUserDto) {
    return this.service.update(req.internal_user_id, dto);
  }

  @Delete()
  @ApiOperation({ summary: 'Eliminar administrador' })
  @ApiResponse({
    status: 200,
    schema: { example: { message: 'Administrador eliminado' } },
  })
  remove(@Request() req, @Body() dto: DeleteUserDto) {
    return this.service.remove(req.internal_user_id, dto);
  }

  @Put('status')
  @ApiOperation({ summary: 'Habilitar/deshabilitar administrador' })
  @ApiResponse({
    status: 200,
    schema: { example: { message: 'El administrador ha sido Habilitado.' } },
  })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  setUserStatus(@Request() req, @Body() body: UpdateUserStatusDto) {
    return this.service.setUserStatus(req.internal_user_id, body);
  }

  @Put('enable')
  @ApiOperation({ summary: 'Habilitar/deshabilitar administrador (legacy)' })
  @ApiResponse({
    status: 200,
    schema: { example: { message: 'Usuario habilitado' } },
  })
  setEnableUser(@Request() req, @Body() body: EnableUserDto) {
    return this.service.setEnableUser(req.internal_user_id, body);
  }

  @Put('recover-password')
  @ApiOperation({ summary: 'Recuperar/restaurar contraseña' })
  @ApiResponse({
    status: 200,
    schema: { example: { message: 'Contraseña restaurada' } },
  })
  recoverPassword(
    @Body() body: { id_user: number; password: string; secret?: boolean },
  ) {
    return this.service.recoverUserPassword(body.id_user, {
      password: body.password,
      secret: body.secret,
    });
  }

  @Get(':id_user/accesses')
  @ApiOperation({ summary: 'Obtener accesos del usuario' })
  @ApiResponse({
    status: 200,
    schema: { example: { admin: true } },
  })
  getUserAccesses(@Param('id_user') id_user: number) {
    return this.service.getUserAccesses(Number(id_user));
  }
}
