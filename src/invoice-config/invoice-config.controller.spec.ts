import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceConfigController } from './invoice-config.controller';
import { InvoiceConfigService } from './invoice-config.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VerifyAdminAdminGuard } from '../auth/guards/verify-admin-admin.guard';
import { VerifyDisabledUserGuard } from '../auth/guards/verify-disabled-user.guard';

describe('InvoiceConfigController', () => {
  let controller: InvoiceConfigController;
  let service: InvoiceConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceConfigController],
      providers: [
        {
          provide: InvoiceConfigService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue({}),
            create: jest.fn().mockResolvedValue({}),
            update: jest.fn().mockResolvedValue({}),
            remove: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: JwtAuthGuard,
          useValue: { canActivate: jest.fn(() => true) },
        },
        {
          provide: VerifyAdminAdminGuard,
          useValue: { canActivate: jest.fn(() => true) },
        },
        {
          provide: VerifyDisabledUserGuard,
          useValue: { canActivate: jest.fn(() => true) },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(VerifyAdminAdminGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(VerifyDisabledUserGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();
    controller = module.get<InvoiceConfigController>(InvoiceConfigController);
    service = module.get<InvoiceConfigService>(InvoiceConfigService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all configs', async () => {
    expect(await controller.findAll()).toEqual([]);
  });

  it('should return one config', async () => {
    expect(await controller.findOne(1)).toEqual({});
  });

  it('should create a config', async () => {
    expect(
      await controller.create({
        config: 'a',
        printer_ip: 'b',
        printer_port: 'c',
      }),
    ).toEqual({});
  });

  it('should update a config', async () => {
    expect(await controller.update(1, { config: 'a' })).toEqual({});
  });

  it('should remove a config', async () => {
    expect(await controller.remove(1)).toEqual({});
  });
});
