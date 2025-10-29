import { Injectable, BadRequestException } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { CatalogVersion } from '../entities/catalog-version.entity';
import { Profile } from '../entities/profile.entity';
import { User } from '../entities/user.entity';
import { Client } from '../entities/client.entity';
import { Op } from 'sequelize';

@Injectable()
export class CatalogsService {
  constructor(private readonly sequelize: Sequelize) {}

  async getCatalogs(query: { catalogs: string[] | string }): Promise<any> {
    const { catalogs } = query;
    const catalogList = Array.isArray(catalogs) ? catalogs : [catalogs];
    if (catalogList.length === 0) {
      throw new BadRequestException('Debe especificar al menos un catálogo');
    }
    const result: Record<string, any[]> = {};
    for (const catalog of catalogList) {
      if (!/^[a-zA-Z0-9_]+$/.test(catalog)) {
        throw new BadRequestException(
          `Nombre de catálogo inválido: ${catalog}`,
        );
      }
      const [rows]: any = await this.sequelize.query(
        `SELECT * FROM \`${catalog}\`;`,
      );
      result[catalog] = rows;
    }
    return result;
  }

  async getCatalogsVersion(): Promise<CatalogVersion[]> {
    const rows = await CatalogVersion.findAll();
    return rows;
  }

  /**
   * Search wallets, clients, and loans by search_word (for search bar)
   */
  async updateCatalogVersion(
    key: string,
    date: Date = new Date(),
  ): Promise<void> {
    await CatalogVersion.upsert({ key, catalog_version: date });
  }

  async getClients(search_word: string) {
    const clientWhere = search_word
      ? {
          [Op.or]: [
            {
              '$profile.identification$': {
                [Op.like]: `%${search_word.trim().replace(/-/g, '')}%`,
              },
            },
            this.sequelize.literal(
              `MATCH(profile.firstname, profile.lastname) AGAINST('${search_word.trim().replace(/'/g, "''")}' IN BOOLEAN MODE)`,
            ),
          ],
        }
      : undefined;

    const clients = await Client.findAll({
      where: clientWhere,
      attributes: [],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id'],
        },
        {
          model: Profile,
          as: 'profile',
          attributes: ['firstname', 'lastname', 'identification'],
        },
      ],
      order: [
        [{ model: Profile, as: 'profile' }, 'firstname', 'ASC'],
        [{ model: Profile, as: 'profile' }, 'lastname', 'ASC'],
        [{ model: Profile, as: 'profile' }, 'identification', 'ASC'],
      ],
    });

    return clients.map((client) => {
      const name = `${client.getDataValue('profile')?.getDataValue('firstname') ?? ''} ${client.getDataValue('profile')?.getDataValue('lastname') ?? ''}`.trim();
      return {
        id_user: client.getDataValue('user')?.getDataValue('id'),
        name: name,
        text: `${name} - ${client.getDataValue('profile')?.getDataValue('identification') ?? ''}`.trim(),
      };
    });
  }
}
