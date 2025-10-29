import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { GetSalesQueryDto } from './dto/get-sales-query.dto';
import { UpdateSaleStatusDto } from './dto/update-sale-status.dto';
import { Sale } from '../entities/sale.entity';
import { SaleService } from './sale.service';
export declare class SaleController {
    private readonly saleService;
    constructor(saleService: SaleService);
    findAll(req: any, query: GetSalesQueryDto): Promise<any>;
    findOne(id: string): Promise<Sale | null>;
    create(req: any, data: CreateSaleDto): Promise<Sale>;
    update(dto: UpdateSaleDto): Promise<[number, Sale[]]>;
    remove(req: any, id: string): Promise<number>;
    updateStatus(req: any, dto: UpdateSaleStatusDto): Promise<[number, Sale[]]>;
}
