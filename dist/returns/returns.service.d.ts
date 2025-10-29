import { Return } from '../entities/return.entity';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';
import { GetReturnsQueryDto } from './dto/get-returns-query.dto';
import { UpdateReturnStatusDto } from './dto/update-return-status.dto';
import { UtilsService } from '../utils/utils.service';
import { GetProductsQueryDto } from './dto/get-products-query.dto';
import { SaleItem } from 'src/entities/sale-item.entity';
import { ReturnItem } from 'src/entities/return-item.entity';
export declare class ReturnsService {
    private readonly returnModel;
    private readonly saleItemModel;
    private readonly returnItemModel;
    private readonly utilsService;
    constructor(returnModel: typeof Return, saleItemModel: typeof SaleItem, returnItemModel: typeof ReturnItem, utilsService: UtilsService);
    create(dto: CreateReturnDto, internal_user_id: number, internal_store_id: number): Promise<Return>;
    findAll(query: GetReturnsQueryDto, id_store?: number): Promise<{
        count: number;
        list: Return[];
        skip: number;
    }>;
    getProducts(query: GetProductsQueryDto): Promise<SaleItem[]>;
    findOne(id: number): Promise<Return>;
    update(dto: UpdateReturnDto, internal_user_id: number): Promise<Return>;
    remove(internal_user_id: number, id: number): Promise<number>;
    updateStatus(internal_user_id: number, dto: UpdateReturnStatusDto): Promise<[number, Return[]]>;
}
