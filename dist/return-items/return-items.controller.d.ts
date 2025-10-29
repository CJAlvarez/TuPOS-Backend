import { ReturnItemsService } from './return-items.service';
import { CreateReturnItemDto } from './dto/create-return-item.dto';
import { UpdateReturnItemDto } from './dto/update-return-item.dto';
import { GetReturnItemsQueryDto } from './dto/get-return-items-query.dto';
import { UpdateReturnItemStatusDto } from './dto/update-return-item-status.dto';
export declare class ReturnItemsController {
    private readonly returnItemsService;
    constructor(returnItemsService: ReturnItemsService);
    create(dto: CreateReturnItemDto, req: any): Promise<import("../entities/return-item.entity").ReturnItem>;
    findAll(req: any, query: GetReturnItemsQueryDto): Promise<{
        count: number;
        list: import("../entities/return-item.entity").ReturnItem[];
        skip: number;
    }>;
    findOne(id: string): Promise<import("../entities/return-item.entity").ReturnItem>;
    update(dto: UpdateReturnItemDto, req: any): Promise<import("../entities/return-item.entity").ReturnItem>;
    remove(id: string, req: any): Promise<number>;
    updateStatus(dto: UpdateReturnItemStatusDto, req: any): Promise<[number, import("../entities/return-item.entity").ReturnItem[]]>;
}
