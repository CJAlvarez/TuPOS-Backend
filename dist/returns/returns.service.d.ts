import { Sequelize } from 'sequelize-typescript';
import { Return } from '../entities/return.entity';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';
import { GetReturnsQueryDto } from './dto/get-returns-query.dto';
import { UpdateReturnStatusDto } from './dto/update-return-status.dto';
import { UtilsService } from '../utils/utils.service';
import { GetProductsQueryDto } from './dto/get-products-query.dto';
import { SaleItem } from 'src/entities/sale-item.entity';
import { ReturnItem } from 'src/entities/return-item.entity';
import { Inventory } from 'src/entities/inventory.entity';
export declare class ReturnsService {
    private readonly returnModel;
    private readonly saleItemModel;
    private readonly returnItemModel;
    private readonly inventoryModel;
    private readonly utilsService;
    private readonly sequelize;
    constructor(returnModel: typeof Return, saleItemModel: typeof SaleItem, returnItemModel: typeof ReturnItem, inventoryModel: typeof Inventory, utilsService: UtilsService, sequelize: Sequelize);
    create(dto: CreateReturnDto, internal_user_id: number, internal_store_id: number): Promise<Return>;
    findAll(query: GetReturnsQueryDto, id_store?: number): Promise<{
        count: number;
        list: Return[];
        skip: number;
    }>;
    getProducts(query: GetProductsQueryDto): Promise<SaleItem[]>;
    findOne(id: number, storeId: number): Promise<Return>;
    update(dto: UpdateReturnDto, internal_user_id: number, storeId: number): Promise<Return>;
    remove(internal_user_id: number, id: number, storeId: number): Promise<any>;
    updateStatus(internal_user_id: number, dto: UpdateReturnStatusDto, storeId: number): Promise<[number, Return[]]>;
    private validateReturnItems;
    private createReturnEntity;
    private buildReturnItemsPayload;
    private getSaleItemsMapForReturnItems;
    private restoreInventoryForReturnItems;
    private restoreToLinkedInventory;
    private restoreToEachInventory;
    private createInventoryRecord;
}
