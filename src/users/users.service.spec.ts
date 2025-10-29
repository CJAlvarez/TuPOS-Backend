import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { Client } from '../entities/client.entity';
import { Profile } from '../entities/profile.entity';
import { Admin } from '../entities/admin.entity';
import { Partner } from '../entities/partner.entity';
import { EmailService } from '../email/email.service';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: any;
  let clientModel: any;
  let profileModel: any;
  let adminModel: any;
  let partnerModel: any;
  let emailService: any;

  beforeEach(async () => {
    userModel = { findOne: jest.fn(), create: jest.fn(), findByPk: jest.fn() };
    clientModel = { build: jest.fn(), findByPk: jest.fn(), create: jest.fn() };
    profileModel = { build: jest.fn(), findOne: jest.fn() };
    adminModel = { build: jest.fn(), findByPk: jest.fn(), create: jest.fn() };
    partnerModel = { findByPk: jest.fn(), create: jest.fn() };
    emailService = { sendEmail: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User), useValue: userModel },
        { provide: getModelToken(Client), useValue: clientModel },
        { provide: getModelToken(Profile), useValue: profileModel },
        { provide: getModelToken(Admin), useValue: adminModel },
        { provide: getModelToken(Partner), useValue: partnerModel },
        { provide: EmailService, useValue: emailService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw if email exists on create', async () => {
    userModel.findOne.mockResolvedValue({});
    await expect(
      service.create(1, {
        email: 'test@mail.com',
        password: '123',
        firstname: '',
        lastname: '',
        id_country: 1,
        identification: '',
        id_gender: 1,
        phone: '',
        id_admin_type: 1,
      }),
    ).rejects.toThrow();
  });

  it('should create user and send email', async () => {
    userModel.findOne.mockResolvedValue(null);
    userModel.create.mockResolvedValue({ id: 1, email: 'test@mail.com' });
    clientModel.build.mockReturnValue({ save: jest.fn() });
    adminModel.build.mockReturnValue({ save: jest.fn() });
    profileModel.build.mockReturnValue({ save: jest.fn() });
    const dto = {
      email: 'test@mail.com',
      password: '123',
      firstname: 'A',
      lastname: 'B',
      id_country: 1,
      identification: 'X',
      id_gender: 1,
      phone: '123',
      id_admin_type: 1,
    };
    await service.create(1, dto);
    expect(userModel.create).toHaveBeenCalled();
    expect(emailService.sendEmail).toHaveBeenCalled();
  });

  it('should update user and profile', async () => {
    userModel.findByPk.mockResolvedValue({
      update: jest.fn().mockResolvedValue({}),
      email: 'test@mail.com',
    });
    profileModel.findOne.mockResolvedValue({ update: jest.fn() });
    const dto = {
      id_user: 1,
      email: 'test@mail.com',
      firstname: 'A',
      lastname: 'B',
      id_country: 1,
      identification: 'X',
      id_gender: 1,
      phone: '123',
    };
    await service.update(dto as any);
    expect(userModel.findByPk).toHaveBeenCalledWith(1);
    expect(profileModel.findOne).toHaveBeenCalledWith({
      where: { id_user: 1 },
    });
  });

  it('should remove user and related entities', async () => {
    userModel.findByPk.mockResolvedValue({ id: 1, update: jest.fn() });
    clientModel.findByPk.mockResolvedValue({ update: jest.fn() });
    adminModel.findByPk.mockResolvedValue({ update: jest.fn() });
    profileModel.findOne.mockResolvedValue({ update: jest.fn() });
    await service.remove(1, { id_user: 1 });
    expect(userModel.findByPk).toHaveBeenCalledWith(1);
    expect(clientModel.findByPk).toHaveBeenCalledWith(1);
    expect(adminModel.findByPk).toHaveBeenCalledWith(1);
    expect(profileModel.findOne).toHaveBeenCalledWith({
      where: { id_user: 1 },
    });
  });
});
