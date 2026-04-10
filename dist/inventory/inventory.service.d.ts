import { Inventory } from '../entities/inventory.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { GetInventoryQueryDto } from './dto/get-inventory-query.dto';
import { UtilsService } from 'src/utils/utils.service';
import { Sequelize } from 'sequelize-typescript';
import { Product } from 'src/entities/product.entity';
export declare class InventoryService {
    private readonly inventoryModel;
    private readonly productModel;
    private readonly utilsService;
    private readonly sequelize;
    constructor(inventoryModel: typeof Inventory, productModel: typeof Product, utilsService: UtilsService, sequelize: Sequelize);
    findAll(query: GetInventoryQueryDto, id_store?: number): Promise<{
        count: number;
        list: Inventory[];
        skip: number;
    }>;
    findOne(id: number): Promise<Inventory | null>;
    create(internal_user_id: number, internal_store_id: number, dto: CreateInventoryDto): Promise<Inventory>;
    update(dto: UpdateInventoryDto): Promise<[number, Inventory[]]>;
    remove(internal_user_id: number, id: number): Promise<number>;
    handleStock(item: any, transaction: any): Promise<void>;
    private calculateUnits;
    private getAvailableInventories;
    private validateStock;
    private applyFifo;
    private bulkUpdateInventories;
}
