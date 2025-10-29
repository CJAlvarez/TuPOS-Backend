import { ReturnItem } from '../entities/return-item.entity';
import { CreateReturnItemDto } from './dto/create-return-item.dto';
import { UpdateReturnItemDto } from './dto/update-return-item.dto';
import { GetReturnItemsQueryDto } from './dto/get-return-items-query.dto';
import { UpdateReturnItemStatusDto } from './dto/update-return-item-status.dto';
import { UtilsService } from '../utils/utils.service';
export declare class ReturnItemsService {
    private readonly returnItemModel;
    private readonly utilsService;
    constructor(returnItemModel: typeof ReturnItem, utilsService: UtilsService);
    create(dto: CreateReturnItemDto, internal_user_id: number): Promise<ReturnItem>;
    findAll(query: GetReturnItemsQueryDto): Promise<{
        count: number;
        list: ReturnItem[];
        skip: number;
    }>;
    findOne(id: number): Promise<ReturnItem>;
    update(dto: UpdateReturnItemDto, internal_user_id: number): Promise<ReturnItem>;
    remove(internal_user_id: number, id: number): Promise<number>;
    updateStatus(internal_user_id: number, dto: UpdateReturnItemStatusDto): Promise<[number, ReturnItem[]]>;
}
