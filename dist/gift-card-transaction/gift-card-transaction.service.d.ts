import { GiftCardTransaction } from '../entities/gift-card-transaction.entity';
import { CreateGiftCardTransactionDto } from './dto/create-gift-card-transaction.dto';
import { UpdateGiftCardTransactionDto } from './dto/update-gift-card-transaction.dto';
import { GetGiftCardTransactionsQueryDto } from './dto/get-gift-card-transactions-query.dto';
import { UpdateGiftCardTransactionStatusDto } from './dto/update-gift-card-transaction-status.dto';
import { UtilsService } from 'src/utils/utils.service';
export declare class GiftCardTransactionService {
    private readonly giftCardTransactionModel;
    private readonly utilsService;
    constructor(giftCardTransactionModel: typeof GiftCardTransaction, utilsService: UtilsService);
    findAll(query: GetGiftCardTransactionsQueryDto, id_store?: number): Promise<{
        count: number;
        list: GiftCardTransaction[];
        skip: number;
    }>;
    findOne(id: number): Promise<GiftCardTransaction | null>;
    create(internal_user_id: number, internal_store_id: number, dto: CreateGiftCardTransactionDto): Promise<GiftCardTransaction>;
    update(dto: UpdateGiftCardTransactionDto): Promise<[number, GiftCardTransaction[]]>;
    remove(internal_user_id: number, id: number): Promise<number>;
    updateStatus(internal_user_id: number, dto: UpdateGiftCardTransactionStatusDto): Promise<[number, GiftCardTransaction[]]>;
}
