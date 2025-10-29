import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { UpdateClientStatusDto } from './dto/update-client-status.dto';
import { VerifyAdminAdminGuard } from '../auth/guards/verify-admin-admin.guard';
import { VerifyDisabledUserGuard } from '../auth/guards/verify-disabled-user.guard';

describe('ClientsController', () => {
  let controller: ClientsController;
  let service: ClientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [
        {
          provide: ClientsService,
          useValue: {
            getClients: jest
              .fn()
              .mockResolvedValue({ count: 1, list: [], offset: 0 }),
            getClientDetail: jest.fn().mockResolvedValue({ id_user: 1 }),
            insertClient: jest.fn().mockResolvedValue({ title: 'ok' }),
            updateClient: jest.fn().mockResolvedValue({ title: 'ok' }),
            updateClientStatus: jest.fn().mockResolvedValue({ title: 'ok' }),
          },
        },
      ],
    })
      .overrideGuard(VerifyDisabledUserGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(VerifyAdminAdminGuard)
      .useValue({ canActivate: () => true })
      .compile();
    controller = module.get<ClientsController>(ClientsController);
    service = module.get<ClientsService>(ClientsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getClients should call service', async () => {
    const result = await controller.getClients({});
    expect(result).toHaveProperty('count');
    expect(service.getClients).toHaveBeenCalled();
  });

  it('getClientDetail should call service', async () => {
    const result = await controller.getClientDetail(1);
    expect(result).toHaveProperty('id_user');
    expect(service.getClientDetail).toHaveBeenCalledWith(1);
  });

  it('insertClient should call service', async () => {
    const dto = {} as CreateClientDto;
    const result = await controller.insertClient(dto);
    expect(result).toHaveProperty('title');
    expect(service.insertClient).toHaveBeenCalledWith(dto);
  });

  it('updateClient should call service', async () => {
    const dto = {} as UpdateClientDto;
    const result = await controller.updateClient(dto);
    expect(result).toHaveProperty('title');
    expect(service.updateClient).toHaveBeenCalledWith(dto);
  });

  it('updateClientStatus should call service', async () => {
    const dto = {} as UpdateClientStatusDto;
    const result = await controller.updateClientStatus(dto);
    expect(result).toHaveProperty('title');
    expect(service.updateClientStatus).toHaveBeenCalledWith(dto);
  });
});
