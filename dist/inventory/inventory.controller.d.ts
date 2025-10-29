import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { GetInventoryQueryDto } from './dto/get-inventory-query.dto';
import { Inventory } from 'src/entities/inventory.entity';
import { InventoryService } from './inventory.service';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    findAll(req: any, query: GetInventoryQueryDto): Promise<any>;
    findOne(id: string): Promise<Inventory | null>;
    create(req: any, data: CreateInventoryDto): Promise<Inventory>;
    update(dto: UpdateInventoryDto): Promise<[number, Inventory[]]>;
    remove(req: any, id: string): Promise<number>;
}
