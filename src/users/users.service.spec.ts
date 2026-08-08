import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { Profile } from '../entities/profile.entity';
import { Admin } from '../entities/admin.entity';
import { UtilsService } from '../utils/utils.service';
import { JobsService } from '../jobs/jobs.service';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: any;
  let profileModel: any;
  let adminModel: any;
  let jobsService: any;
  let utilsService: any;
  let sequelize: any;

  beforeEach(async () => {
    userModel = { findOne: jest.fn(), create: jest.fn(), findByPk: jest.fn() };
    profileModel = {
      create: jest.fn(),
      update: jest.fn(),
      findOne: jest.fn(),
    };
    adminModel = {
      create: jest.fn(),
      findByPk: jest.fn(),
      count: jest.fn(),
      findAll: jest.fn(),
    };
    jobsService = { addJob: jest.fn() };
    utilsService = {
      paginate: jest.fn().mockReturnValue({ limit: 10, skip: 0, offset: 0 }),
      generateToken: jest.fn().mockReturnValue('secret12'),
    };
    sequelize = { literal: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User), useValue: userModel },
        { provide: getModelToken(Profile), useValue: profileModel },
        { provide: getModelToken(Admin), useValue: adminModel },
        { provide: JobsService, useValue: jobsService },
        { provide: UtilsService, useValue: utilsService },
        { provide: Sequelize, useValue: sequelize },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should list admins joined with user and profile', async () => {
    adminModel.count.mockResolvedValue(1);
    adminModel.findAll.mockResolvedValue([
      { toJSON: () => ({ id_user: 1, id_admin_type: 2 }) },
    ]);
    const res = await service.findAll({} as any);
    expect(res.count).toBe(1);
    expect(res.list).toEqual([{ id_user: 1, id_admin_type: 2 }]);
  });

  it('should throw if email exists on create', async () => {
    userModel.findOne.mockResolvedValue({});
    await expect(
      service.create(1, {
        user: { email: 'test@mail.com', password: '12345678' },
        profile: {
          firstname: 'A',
          lastname: 'B',
          id_country: 1,
          identification: 'X',
          id_gender: 1,
          phone: '123',
        },
        id_admin_type: 2,
      } as any),
    ).rejects.toThrow();
  });

  it('should create admin with hashed password and send email', async () => {
    userModel.findOne.mockResolvedValue(null);
    userModel.create.mockResolvedValue({ id: 1, email: 'test@mail.com' });
    adminModel.create.mockResolvedValue({});
    profileModel.create.mockResolvedValue({});
    const dto = {
      user: { email: 'test@mail.com', password: '12345678' },
      profile: {
        firstname: 'A',
        lastname: 'B',
        id_country: 1,
        identification: 'X',
        id_gender: 1,
        phone: '123',
      },
      id_admin_type: 2,
    };
    await service.create(1, dto as any);
    const createdWith = userModel.create.mock.calls[0][0];
    expect(createdWith.password).not.toBe('12345678'); // hashed
    expect(adminModel.create).toHaveBeenCalled();
    expect(jobsService.addJob).toHaveBeenCalled();
  });

  it('should update the targeted admin by id', async () => {
    userModel.findByPk.mockResolvedValue({
      update: jest.fn().mockResolvedValue({}),
      email: 'test@mail.com',
    });
    profileModel.update.mockResolvedValue([1]);
    adminModel.findByPk.mockResolvedValue({ update: jest.fn() });
    const dto = {
      user: { id: 1, email: 'test@mail.com' },
      profile: { firstname: 'A', lastname: 'B' },
      id_admin_type: 2,
    };
    await service.update(1, dto as any);
    expect(userModel.findByPk).toHaveBeenCalledWith(1);
    expect(profileModel.update).toHaveBeenCalled();
  });

  it('should re-enable admin by clearing disabled_at', async () => {
    const update = jest.fn();
    adminModel.findByPk.mockResolvedValue({ update });
    await service.setUserStatus(9, { id: 1, enable: true });
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({ disabled_at: null }),
    );
  });

  it('should remove admin and related entities', async () => {
    userModel.findByPk.mockResolvedValue({ id: 1, update: jest.fn() });
    adminModel.findByPk.mockResolvedValue({ update: jest.fn() });
    profileModel.findOne.mockResolvedValue({ update: jest.fn() });
    await service.remove(1, { id_user: 1 });
    expect(userModel.findByPk).toHaveBeenCalledWith(1);
    expect(adminModel.findByPk).toHaveBeenCalledWith(1);
  });
});
