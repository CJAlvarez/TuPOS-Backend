import { CreateCashboxDto } from './dto/create-cashbox.dto';
import { UpdateCashboxDto } from './dto/update-cashbox.dto';
import { GetCashboxesQueryDto } from './dto/get-cashboxes-query.dto';
import { UpdateCashboxStatusDto } from './dto/update-cashbox-status.dto';
import { OpenCashboxDto } from './dto/open-cashbox.dto';
import { CloseCashboxDto } from './dto/close-cashbox.dto';
import { Cashbox } from '../entities/cashbox.entity';
import { CashboxService } from './cashbox.service';
export declare class CashboxController {
    private readonly cashboxService;
    constructor(cashboxService: CashboxService);
    findAll(req: any, query: GetCashboxesQueryDto): Promise<any>;
    findOne(id: string): Promise<Cashbox | null>;
    create(req: any, data: CreateCashboxDto): Promise<Cashbox>;
    update(dto: UpdateCashboxDto): Promise<[number, Cashbox[]]>;
    remove(req: any, id: string): Promise<number>;
    updateStatus(req: any, dto: UpdateCashboxStatusDto): Promise<[number, Cashbox[]]>;
    openCashbox(req: any, dto: OpenCashboxDto): Promise<[number, Cashbox[]]>;
    closeCashbox(req: any, dto: CloseCashboxDto): Promise<[number, Cashbox[]]>;
}
