import { SaleItem } from '../entities/sale-item.entity';
import { CreateSaleItemDto } from './dto/create-sale-item.dto';
import { UpdateSaleItemDto } from './dto/update-sale-item.dto';
import { GetSaleItemsQueryDto } from './dto/get-sale-items-query.dto';
import { UpdateSaleItemStatusDto } from './dto/update-sale-item-status.dto';
import { UtilsService } from 'src/utils/utils.service';
export declare class SaleItemService {
    private readonly saleItemModel;
    private readonly utilsService;
    constructor(saleItemModel: typeof SaleItem, utilsService: UtilsService);
    findAll(query: GetSaleItemsQueryDto, id_store?: number): Promise<{
        count: number;
        list: SaleItem[];
        skip: number;
    }>;
    findOne(id: number): Promise<SaleItem | null>;
    create(internal_user_id: number, internal_store_id: number, dto: CreateSaleItemDto): Promise<SaleItem>;
    update(dto: UpdateSaleItemDto): Promise<[number, SaleItem[]]>;
    remove(internal_user_id: number, id: number): Promise<number>;
    updateStatus(internal_user_id: number, dto: UpdateSaleItemStatusDto): Promise<[number, SaleItem[]]>;
}
