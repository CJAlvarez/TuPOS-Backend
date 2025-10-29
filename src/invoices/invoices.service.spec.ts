import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesService } from './invoices.service';
import { getModelToken } from '@nestjs/sequelize';
import { Invoice } from '../entities/invoice.entity';

const invoiceArray = [
  { id: 1, number: 'A1', total: 100, client: 'Cliente', id_user: 1 },
];

const invoiceInstance = {
  ...invoiceArray[0],
  update: jest.fn().mockResolvedValue(invoiceArray[0]),
  destroy: jest.fn().mockResolvedValue(undefined),
};

describe('InvoicesService', () => {
  let service: InvoicesService;
  let model: typeof Invoice;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoicesService,
        {
          provide: getModelToken(Invoice),
          useValue: {
            findAll: jest.fn().mockResolvedValue(invoiceArray),
            findAndCountAll: jest
              .fn()
              .mockResolvedValue({ count: 1, rows: invoiceArray }),
            findByPk: jest
              .fn()
              .mockImplementation((id) => (id === 1 ? invoiceInstance : null)),
            create: jest.fn().mockResolvedValue(invoiceArray[0]),
          },
        },
      ],
    }).compile();
    service = module.get<InvoicesService>(InvoicesService);
    model = module.get<typeof Invoice>(getModelToken(Invoice));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all invoices with count', async () => {
    expect(await service.findAll({})).toEqual({
      count: 1,
      list: invoiceArray,
      skip: 0,
    });
  });

  it('should return one invoice', async () => {
    expect(await service.findOne(1)).toEqual(invoiceInstance);
  });

  it('should create an invoice', async () => {
    expect(await service.create({} as any)).toEqual(invoiceArray[0]);
  });

  it('should update an invoice', async () => {
    expect(await service.update(1, {} as any)).toEqual(invoiceArray[0]);
  });

  it('should remove an invoice', async () => {
    expect(await service.remove(1)).toEqual({ message: 'Factura eliminada' });
  });
});
