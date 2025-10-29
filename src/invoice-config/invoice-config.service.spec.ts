import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { InvoiceConfigService } from './invoice-config.service';
import { InvoiceConfig } from '../entities/invoice-config.entity';

describe('InvoiceConfigService', () => {
  let service: InvoiceConfigService;
  let model: typeof InvoiceConfig;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceConfigService,
        {
          provide: getModelToken(InvoiceConfig),
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue([]),
            findByPk: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue({}),
            update: jest.fn().mockResolvedValue({}),
            destroy: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();
    service = module.get<InvoiceConfigService>(InvoiceConfigService);
    model = module.get<typeof InvoiceConfig>(getModelToken(InvoiceConfig));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all configs', async () => {
    expect(await service.findAll()).toEqual([]);
  });

  it('should throw NotFoundException for findOne', async () => {
    await expect(service.findOne(1)).rejects.toThrow(
      'Configuración de factura no encontrada',
    );
  });

  it('should create a config', async () => {
    expect(
      await service.create({ config: 'a', printer_ip: 'b', printer_port: 'c' }),
    ).toEqual({});
  });

  it('should throw NotFoundException for update', async () => {
    await expect(service.update(1, { config: 'a' })).rejects.toThrow(
      'Configuración de factura no encontrada',
    );
  });

  it('should throw NotFoundException for remove', async () => {
    await expect(service.remove(1)).rejects.toThrow(
      'Configuración de factura no encontrada',
    );
  });
});
