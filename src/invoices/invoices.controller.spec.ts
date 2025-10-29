import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VerifyAdminAdminGuard } from '../auth/guards/verify-admin-admin.guard';
import { VerifyDisabledUserGuard } from '../auth/guards/verify-disabled-user.guard';

describe('InvoicesController', () => {
  let controller: InvoicesController;
  let service: InvoicesService;

  const mockService = {
    findAll: jest
      .fn()
      .mockResolvedValue({ count: 1, list: [{ id: 1 }], skip: 0 }),
    findOne: jest.fn().mockResolvedValue({ id: 1 }),
    create: jest.fn().mockResolvedValue({ id: 1 }),
    update: jest.fn().mockResolvedValue({ id: 1 }),
    remove: jest.fn().mockResolvedValue({ message: 'Factura eliminada' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoicesController],
      providers: [
        { provide: InvoicesService, useValue: mockService },
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
    controller = module.get<InvoicesController>(InvoicesController);
    service = module.get<InvoicesService>(InvoicesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all invoices', async () => {
    expect(await controller.findAll({})).toEqual({
      count: 1,
      list: [{ id: 1 }],
      skip: 0,
    });
  });

  it('should return one invoice', async () => {
    expect(await controller.findOne(1)).toEqual({ id: 1 });
  });

  it('should create an invoice', async () => {
    expect(await controller.create({} as any)).toEqual({ id: 1 });
  });

  it('should update an invoice', async () => {
    expect(await controller.update(1, {} as any)).toEqual({ id: 1 });
  });

  it('should remove an invoice', async () => {
    expect(await controller.remove(1)).toEqual({
      message: 'Factura eliminada',
    });
  });
});
