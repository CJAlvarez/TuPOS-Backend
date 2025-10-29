import { Inventory } from '../entities/inventory.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { GetInventoryQueryDto } from './dto/get-inventory-query.dto';
import { UtilsService } from 'src/utils/utils.service';
export declare class InventoryService {
    private readonly inventoryModel;
    private readonly utilsService;
    constructor(inventoryModel: typeof Inventory, utilsService: UtilsService);
    findAll(query: GetInventoryQueryDto, id_store?: number): Promise<{
        count: number;
        list: Inventory[];
        skip: number;
    }>;
    findOne(id: number): Promise<Inventory | null>;
    create(internal_user_id: number, internal_store_id: number, dto: CreateInventoryDto): Promise<Inventory>;
    update(dto: UpdateInventoryDto): Promise<[number, Inventory[]]>;
    remove(internal_user_id: number, id: number): Promise<number>;
}
