import { CatalogsService } from './catalogs.service';
export declare class CatalogsController {
    private readonly catalogsService;
    constructor(catalogsService: CatalogsService);
    getCatalogs(query: any): Promise<any>;
    getCatalogsVersion(): Promise<import("../entities/catalog-version.entity").CatalogVersion[]>;
    updateCatalogVersion(key: string, date?: string): Promise<{
        key: string;
        catalog_version: string;
    }>;
    getClients(search_word: string): Promise<{
        id_user: number | undefined;
        name: string;
        text: string;
    }[]>;
}
