import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VerifyAdminAdminGuard } from '../auth/guards/verify-admin-admin.guard';
import { VerifyDisabledUserGuard } from '../auth/guards/verify-disabled-user.guard';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const mockService = {
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      setEnableUser: jest.fn(),
      setUserAdmin: jest.fn(),
      setUserPartner: jest.fn(),
      setUserClient: jest.fn(),
      recoverPassword: jest.fn(),
      getUserAccesses: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .overrideGuard(VerifyDisabledUserGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .overrideGuard(VerifyAdminAdminGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();
    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.create on create', async () => {
    const dto = {} as CreateUserDto;
    await controller.create({ internal_user_id: 1 }, dto);
    expect(service.create).toHaveBeenCalledWith(1, dto);
  });

  it('should call service.update on update', async () => {
    const dto = {} as UpdateUserDto;
    await controller.update(dto);
    expect(service.update).toHaveBeenCalledWith(dto);
  });

  it('should call service.remove on remove', async () => {
    const dto = {} as DeleteUserDto;
    await controller.remove({ internal_user_id: 1 }, dto);
    expect(service.remove).toHaveBeenCalledWith(1, dto);
  });

  it('should call service.setEnableUser', async () => {
    const body = { id_user: 1, enable: true, internal_user_id: 2 };
    await controller.setEnableUser({ internal_user_id: 1 }, body);
    expect(service.setEnableUser).toHaveBeenCalledWith(1, body);
  });

  it('should call service.setUserAdmin', async () => {
    const body = { id_user: 1 };
    await controller.setUserAdmin(body);
    expect(service.setUserAdmin).toHaveBeenCalledWith(1);
  });

  it('should call service.setUserPartner', async () => {
    const body = { id_user: 1 };
    await controller.setUserPartner(body);
    expect(service.setUserPartner).toHaveBeenCalledWith(1);
  });

  it('should call service.setUserClient', async () => {
    const body = { id_user: 1 };
    await controller.setUserClient(body);
    expect(service.setUserClient).toHaveBeenCalledWith(1);
  });

  it('should call service.recoverPassword', async () => {
    const body = { id_user: 1, password: '123' };
    await controller.recoverPassword(body);
    expect(service.recoverPassword).toHaveBeenCalledWith(1, '123');
  });

  it('should call service.getUserAccesses', async () => {
    await controller.getUserAccesses(1);
    expect(service.getUserAccesses).toHaveBeenCalledWith(1);
  });
});
