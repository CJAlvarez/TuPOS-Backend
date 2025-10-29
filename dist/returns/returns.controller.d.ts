import { ReturnsService } from './returns.service';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';
import { GetReturnsQueryDto } from './dto/get-returns-query.dto';
import { UpdateReturnStatusDto } from './dto/update-return-status.dto';
import { GetProductsQueryDto } from './dto/get-products-query.dto';
export declare class ReturnsController {
    private readonly returnsService;
    constructor(returnsService: ReturnsService);
    create(dto: CreateReturnDto, req: any): Promise<import("../entities/return.entity").Return>;
    findAll(req: any, query: GetReturnsQueryDto): Promise<{
        count: number;
        list: import("../entities/return.entity").Return[];
        skip: number;
    }>;
    getProducts(query: GetProductsQueryDto): Promise<import("../entities/sale-item.entity").SaleItem[]>;
    findOne(id: string): Promise<import("../entities/return.entity").Return>;
    update(dto: UpdateReturnDto, req: any): Promise<import("../entities/return.entity").Return>;
    remove(id: string, req: any): Promise<number>;
    updateStatus(dto: UpdateReturnStatusDto, req: any): Promise<[number, import("../entities/return.entity").Return[]]>;
}
