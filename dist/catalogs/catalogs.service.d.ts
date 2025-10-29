import { Sequelize } from 'sequelize-typescript';
import { CatalogVersion } from '../entities/catalog-version.entity';
export declare class CatalogsService {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    getCatalogs(query: {
        catalogs: string[] | string;
    }): Promise<any>;
    getCatalogsVersion(): Promise<CatalogVersion[]>;
    updateCatalogVersion(key: string, date?: Date): Promise<void>;
    getClients(search_word: string): Promise<{
        id_user: number | undefined;
        name: string;
        text: string;
    }[]>;
}
