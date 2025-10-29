import { Store } from '../entities/store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { GetStoresQueryDto } from './dto/get-stores-query.dto';
import { UpdateStoreStatusDto } from './dto/update-store-status.dto';
import { UtilsService } from 'src/utils/utils.service';
export declare class StoreService {
    private readonly storeModel;
    private readonly utilsService;
    constructor(storeModel: typeof Store, utilsService: UtilsService);
    findAll(query: GetStoresQueryDto): Promise<{
        count: number;
        list: Store[];
        skip: number;
    }>;
    findOne(id: number): Promise<Store | null>;
    create(internal_user_id: number, dto: CreateStoreDto): Promise<Store>;
    update(dto: UpdateStoreDto): Promise<[number, Store[]]>;
    remove(internal_user_id: number, id: number): Promise<number>;
    updateStatus(internal_user_id: number, dto: UpdateStoreStatusDto): Promise<[number, Store[]]>;
}
