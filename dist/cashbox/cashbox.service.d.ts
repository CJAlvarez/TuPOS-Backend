import { Cashbox } from '../entities/cashbox.entity';
import { CreateCashboxDto } from './dto/create-cashbox.dto';
import { UpdateCashboxDto } from './dto/update-cashbox.dto';
import { GetCashboxesQueryDto } from './dto/get-cashboxes-query.dto';
import { UpdateCashboxStatusDto } from './dto/update-cashbox-status.dto';
import { UtilsService } from 'src/utils/utils.service';
import { OpenCashboxDto } from './dto/open-cashbox.dto';
import { CloseCashboxDto } from './dto/close-cashbox.dto';
export declare class CashboxService {
    private readonly cashboxModel;
    private readonly utilsService;
    constructor(cashboxModel: typeof Cashbox, utilsService: UtilsService);
    findAll(query: GetCashboxesQueryDto, id_store?: number): Promise<{
        count: number;
        list: Cashbox[];
        skip: number;
    }>;
    findOne(id: number): Promise<Cashbox | null>;
    create(internal_user_id: number, internal_store_id: number, dto: CreateCashboxDto): Promise<Cashbox>;
    update(dto: UpdateCashboxDto): Promise<[number, Cashbox[]]>;
    remove(internal_user_id: number, id: number): Promise<number>;
    updateStatus(internal_user_id: number, dto: UpdateCashboxStatusDto): Promise<[number, Cashbox[]]>;
    openCashbox(internal_user_id: number, dto: OpenCashboxDto): Promise<[number, Cashbox[]]>;
    closeCashbox(internal_user_id: number, dto: CloseCashboxDto): Promise<[number, Cashbox[]]>;
}
