import { CreateSaleItemDto } from './dto/create-sale-item.dto';
import { UpdateSaleItemDto } from './dto/update-sale-item.dto';
import { GetSaleItemsQueryDto } from './dto/get-sale-items-query.dto';
import { UpdateSaleItemStatusDto } from './dto/update-sale-item-status.dto';
import { SaleItem } from '../entities/sale-item.entity';
import { SaleItemService } from './sale-item.service';
export declare class SaleItemController {
    private readonly saleItemService;
    constructor(saleItemService: SaleItemService);
    findAll(req: any, query: GetSaleItemsQueryDto): Promise<any>;
    findOne(id: string): Promise<SaleItem | null>;
    create(req: any, data: CreateSaleItemDto): Promise<SaleItem>;
    update(dto: UpdateSaleItemDto): Promise<[number, SaleItem[]]>;
    remove(req: any, id: string): Promise<number>;
    updateStatus(req: any, dto: UpdateSaleItemStatusDto): Promise<[number, SaleItem[]]>;
}
