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
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EnableUserDto } from './dto/enable-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
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
  @ApiOperation({ summary: 'Obtener lista de usuarios' })
  @ApiResponse({
    status: 200,
    schema: { example: { count: 100, list: [], skip: 0 } },
  })
  findAll(@Request() req, @Query() query: any) {
    return this.service.findAll(query);
  }

  @Post()
  @ApiOperation({ summary: 'Crear usuario' })
  @ApiResponse({ status: 201, type: User })
  create(@Request() req, @Body() dto: CreateUserDto) {
    return this.service.create(req.internal_user_id, dto);
  }

  @Put()
  @ApiOperation({ summary: 'Actualizar usuario' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, type: User })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @UseInterceptors(FileFieldsInterceptor([]))
  update(@Request() req, @Body() dto: UpdateUserDto) {
    return this.service.update(req.internal_user_id, dto);
  }

  @Delete()
  @ApiOperation({ summary: 'Eliminar usuario' })
  @ApiResponse({
    status: 200,
    schema: { example: { message: 'Usuario eliminado' } },
  })
  remove(@Request() req, @Body() dto: DeleteUserDto) {
    return this.service.remove(req.internal_user_id, dto);
  }

  @Put('enable')
  @ApiOperation({ summary: 'Habilitar/deshabilitar usuario' })
  @ApiResponse({
    status: 200,
    schema: { example: { message: 'Usuario habilitado' } },
  })
  setEnableUser(
    @Request() req,
    @Body() body: EnableUserDto,
  ) {
    return this.service.setEnableUser(req.internal_user_id, body);
  }

  @Put('admin')
  @ApiOperation({ summary: 'Convertir usuario en admin' })
  @ApiResponse({
    status: 200,
    schema: { example: { message: 'Usuario convertido a admin' } },
  })
  setUserAdmin(@Body() body: { id_user: number }) {
    return this.service.setUserAdmin(body.id_user);
  }

  @Put('client')
  @ApiOperation({ summary: 'Convertir usuario en client' })
  @ApiResponse({
    status: 200,
    schema: { example: { message: 'Usuario convertido a client' } },
  })
  setUserClient(@Body() body: { id_user: number }) {
    return this.service.setUserClient(body.id_user);
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
    schema: { example: { admin: true, partner: false, client: true } },
  })
  getUserAccesses(@Param('id_user') id_user: number) {
    return this.service.getUserAccesses(Number(id_user));
  }
}
