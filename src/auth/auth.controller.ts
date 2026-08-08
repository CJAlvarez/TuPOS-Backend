import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Request,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { FirstLoginDto } from './dto/first-login.dto';
import { VerifyDisabledUserGuard } from './guards/verify-disabled-user.guard';
import { VerifyAdminAdminGuard } from './guards/verify-admin-admin.guard';
import { VerifyTokenGuard } from './guards/verify-token.guard';
import { UploadedFile } from './types/uploaded-file.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('profile')
  @UseGuards(VerifyTokenGuard)
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('user-data')
  @UseGuards(VerifyTokenGuard, VerifyDisabledUserGuard, VerifyAdminAdminGuard)
  async getUserData(@Request() req) {
    return this.authService.getUserData(req.internal_user_id);
  }

  @Post('change-password')
  @UseGuards(VerifyTokenGuard)
  changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(
      req.user?.internal_user_id ?? req.internal_user_id,
      dto,
    );
  }

  @Post('recover-password')
  recoverPassword(@Body() dto: RecoverPasswordDto) {
    return this.authService.recoverPassword(dto);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  // The first-login form is submitted as multipart/form-data (it may carry an
  // avatar file), so the request needs a multipart parser before @Body() can be
  // populated. AnyFilesInterceptor is a no-op for application/json payloads.
  @Post('first-login')
  @UseGuards(VerifyTokenGuard)
  @UseInterceptors(AnyFilesInterceptor())
  @ApiConsumes('multipart/form-data', 'application/json')
  firstLogin(
    @Request() req,
    @Body() dto: FirstLoginDto,
    @UploadedFiles() files?: UploadedFile[],
  ) {
    return this.authService.firstLogin(req.internal_user_id, dto, files?.[0]);
  }

  // Agrega más endpoints según la lógica original
}
