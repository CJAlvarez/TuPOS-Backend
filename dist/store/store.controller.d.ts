import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { GetStoresQueryDto } from './dto/get-stores-query.dto';
import { UpdateStoreStatusDto } from './dto/update-store-status.dto';
import { Store } from 'src/entities/store.entity';
import { StoreService } from './store.service';
export declare class StoreController {
    private readonly storeService;
    constructor(storeService: StoreService);
    findAll(req: any, query: GetStoresQueryDto): Promise<any>;
    findOne(id: string): Promise<Store | null>;
    create(req: any, data: CreateStoreDto): Promise<Store>;
    update(dto: UpdateStoreDto): Promise<[number, Store[]]>;
    remove(req: any, id: string): Promise<number>;
    updateStatus(req: any, dto: UpdateStoreStatusDto): Promise<[number, Store[]]>;
}
