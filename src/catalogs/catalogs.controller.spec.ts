import { Test, TestingModule } from '@nestjs/testing';
import { CatalogsController } from './catalogs.controller';
import { CatalogsService } from './catalogs.service';

describe('CatalogsController', () => {
  let controller: CatalogsController;
  let service: CatalogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatalogsController],
      providers: [
        {
          provide: CatalogsService,
          useValue: {
            getCatalogs: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CatalogsController>(CatalogsController);
    service = module.get<CatalogsService>(CatalogsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.getCatalogs with query', async () => {
    const query = { catalogs: ['users'] };
    const result = { users: [{ id: 1, name: 'Test' }] };
    jest.spyOn(service, 'getCatalogs').mockResolvedValue(result);
    expect(await controller.getCatalogs(query)).toEqual(result);
    expect(service.getCatalogs).toHaveBeenCalledWith(query);
  });
});
