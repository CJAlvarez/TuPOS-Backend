import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    changePassword: jest.fn(),
    recoverPassword: jest.fn(),
    resetPassword: jest.fn(),
    firstLogin: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call login', async () => {
    const dto = { username: 'test', password: '1234' };
    const result = { access_token: 'token', user: { id: 1 } };
    mockAuthService.login.mockResolvedValue(result);
    expect(await controller.login(dto)).toEqual(result);
    expect(mockAuthService.login).toHaveBeenCalledWith(dto);
  });

  it('should call recoverPassword', async () => {
    const dto = { email: 'test@mail.com' };
    const result = { message: 'Correo enviado' };
    mockAuthService.recoverPassword.mockResolvedValue(result);
    expect(await controller.recoverPassword(dto)).toEqual(result);
    expect(mockAuthService.recoverPassword).toHaveBeenCalledWith(dto);
  });

  it('should call resetPassword', async () => {
    const req = { internal_user_id: 1 };
    const dto = { token: 'token', newPassword: 'new' };
    const result = { message: 'Contraseña reseteada' };
    mockAuthService.resetPassword.mockResolvedValue(result);
    expect(await controller.resetPassword(req, dto)).toEqual(result);
    expect(mockAuthService.resetPassword).toHaveBeenCalledWith(
      req.internal_user_id,
      dto,
    );
  });

  it('should call firstLogin', async () => {
    const req = { internal_user_id: 1 };
    const dto = { password: 'new', confirmPassword: 'new' };
    const result = { message: 'Primer login exitoso' };
    mockAuthService.firstLogin.mockResolvedValue(result);
    expect(await controller.firstLogin(req, dto)).toEqual(result);
    expect(mockAuthService.firstLogin).toHaveBeenCalledWith(
      req.internal_user_id,
      dto,
    );
  });

  it('should call changePassword', async () => {
    const req = { internal_user_id: 1 };
    const dto = {
      currentPassword: 'old',
      password: 'new',
      confirmPassword: 'new',
    };
    const result = {
      title: 'Operación Exitosa',
      message: 'La contraseña se ha guardado exitosamente.',
    };
    mockAuthService.changePassword.mockResolvedValue(result);
    expect(await controller.changePassword(req, dto)).toEqual(result);
    expect(mockAuthService.changePassword).toHaveBeenCalledWith(
      req.internal_user_id,
      dto,
    );
  });

  it('should throw error if changePassword fails', async () => {
    const req = { internal_user_id: 1 };
    const dto = {
      currentPassword: 'old',
      password: 'new',
      confirmPassword: 'new',
    };
    mockAuthService.changePassword.mockRejectedValue(
      new BadRequestException('error'),
    );
    await expect(controller.changePassword(req, dto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw error if login fails', async () => {
    const dto = { username: 'fail', password: 'fail' };
    mockAuthService.login.mockRejectedValue(new UnauthorizedException('error'));
    await expect(controller.login(dto)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw error if recoverPassword fails', async () => {
    const dto = { email: 'fail@mail.com' };
    mockAuthService.recoverPassword.mockRejectedValue(
      new NotFoundException('error'),
    );
    await expect(controller.recoverPassword(dto)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw error if resetPassword fails', async () => {
    const req = { internal_user_id: 1 };
    const dto = { token: 'bad', newPassword: 'bad' };
    mockAuthService.resetPassword.mockRejectedValue(
      new BadRequestException('error'),
    );
    await expect(controller.resetPassword(req, dto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw error if firstLogin fails', async () => {
    const req = { internal_user_id: 1 };
    const dto = { password: 'bad', confirmPassword: 'bad' };
    mockAuthService.firstLogin.mockRejectedValue(
      new BadRequestException('error'),
    );
    await expect(controller.firstLogin(req, dto)).rejects.toThrow(
      BadRequestException,
    );
  });
});
