import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service';
import { getModelToken } from '@nestjs/sequelize';
import { Client } from '../entities/client.entity';
import { User } from '../entities/user.entity';
import { Profile } from '../entities/profile.entity';
import { EmailService } from '../email/email.service';

describe('ClientsService', () => {
  let service: ClientsService;
  let clientModel: any;
  let userModel: any;
  let profileModel: any;
  let emailService: any;

  beforeEach(async () => {
    clientModel = {
      findAndCountAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    userModel = { findOne: jest.fn(), create: jest.fn(), update: jest.fn() };
    profileModel = { findOne: jest.fn(), create: jest.fn(), update: jest.fn() };
    emailService = { sendEmailTemplate: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        { provide: getModelToken(Client), useValue: clientModel },
        { provide: getModelToken(User), useValue: userModel },
        { provide: getModelToken(Profile), useValue: profileModel },
        { provide: EmailService, useValue: emailService },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getClients should return count and list', async () => {
    clientModel.findAndCountAll.mockResolvedValue({
      count: 1,
      rows: [{ id_user: 1 }],
    });
    const result = await service.getClients({});
    expect(result).toEqual({ count: 1, list: [{ id_user: 1 }], offset: 0 });
  });

  it('getClientDetail should return client', async () => {
    clientModel.findOne.mockResolvedValue({ id_user: 1 });
    const result = await service.getClientDetail(1);
    expect(result).toEqual({ id_user: 1 });
  });

  it('insertClient should create user, client and profile', async () => {
    userModel.findOne.mockResolvedValue(null);
    profileModel.findOne.mockResolvedValue(null);
    userModel.create.mockResolvedValue({ id: 1 });
    clientModel.create.mockResolvedValue({});
    profileModel.create.mockResolvedValue({});
    const dto = {
      user: { email: 'a@a.com', username: 'a', password: 'x', created_by: 1 },
      profile: {
        firstname: 'a',
        lastname: 'b',
        id_country: 1,
        identification: '123',
        id_gender: 1,
      },
    };
    const result = await service.insertClient(dto as any);
    expect(result).toHaveProperty('title');
    expect(userModel.create).toHaveBeenCalled();
    expect(clientModel.create).toHaveBeenCalled();
    expect(profileModel.create).toHaveBeenCalled();
  });

  it('updateClient should update user and profile', async () => {
    clientModel.findOne.mockResolvedValue({ id_user: 1 });
    userModel.update.mockResolvedValue([1]);
    profileModel.update.mockResolvedValue([1]);
    const dto = {
      userId: 1,
      user: { email: 'a@a.com' },
      profile: { firstname: 'a' },
    };
    const result = await service.updateClient(dto as any);
    expect(result).toHaveProperty('title');
    expect(userModel.update).toHaveBeenCalled();
    expect(profileModel.update).toHaveBeenCalled();
  });

  it('updateClientStatus should update client and send email', async () => {
    clientModel.update.mockResolvedValue([1]);
    userModel.findOne.mockResolvedValue({ email: 'a@a.com' });
    profileModel.findOne.mockResolvedValue({ firstname: 'a', lastname: 'b' });
    emailService.sendEmailTemplate.mockResolvedValue(true);
    const dto = { id: 1, enable: true, disabled_by: 2 };
    const result = await service.updateClientStatus(dto as any);
    expect(result).toHaveProperty('title');
    expect(clientModel.update).toHaveBeenCalled();
    expect(emailService.sendEmailTemplate).toHaveBeenCalled();
  });
});
