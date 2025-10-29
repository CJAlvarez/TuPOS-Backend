import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { FirstLoginDto } from './dto/first-login.dto';
import { VerifyDisabledUserGuard } from './guards/verify-disabled-user.guard';
import { VerifyAdminAdminGuard } from './guards/verify-admin-admin.guard';
import { VerifyTokenGuard } from './guards/verify-token.guard';

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

  @Post('first-login')
  @UseGuards(VerifyTokenGuard)
  firstLogin(@Request() req, @Body() dto: FirstLoginDto) {
    return this.authService.firstLogin(req.internal_user_id, dto);
  }

  // Agrega más endpoints según la lógica original
}
