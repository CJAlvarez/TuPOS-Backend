import { CatalogsService } from './catalogs.service';
import { BadRequestException } from '@nestjs/common';

describe('CatalogsService', () => {
  let service: CatalogsService;
  let sequelize: any;

  beforeEach(() => {
    sequelize = {
      query: jest.fn(),
    };
    service = new CatalogsService(sequelize);
  });

  it('should throw if catalogs is not an array', async () => {
    await expect(
      service.getCatalogs({ catalogs: undefined } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw if catalogs is empty', async () => {
    await expect(service.getCatalogs({ catalogs: [] })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw if catalog name is invalid', async () => {
    await expect(
      service.getCatalogs({ catalogs: ['invalid;DROP TABLE'] }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should return result for valid catalogs', async () => {
    sequelize.query.mockResolvedValueOnce([[{ id: 1, name: 'Test' }]]);
    const result = await service.getCatalogs({ catalogs: ['users'] });
    expect(result).toEqual({ users: [{ id: 1, name: 'Test' }] });
  });
});
