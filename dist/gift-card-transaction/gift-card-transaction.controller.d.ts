import { CreateGiftCardTransactionDto } from './dto/create-gift-card-transaction.dto';
import { UpdateGiftCardTransactionDto } from './dto/update-gift-card-transaction.dto';
import { GetGiftCardTransactionsQueryDto } from './dto/get-gift-card-transactions-query.dto';
import { UpdateGiftCardTransactionStatusDto } from './dto/update-gift-card-transaction-status.dto';
import { GiftCardTransaction } from '../entities/gift-card-transaction.entity';
import { GiftCardTransactionService } from './gift-card-transaction.service';
export declare class GiftCardTransactionController {
    private readonly giftCardTransactionService;
    constructor(giftCardTransactionService: GiftCardTransactionService);
    findAll(req: any, query: GetGiftCardTransactionsQueryDto): Promise<any>;
    findOne(id: string): Promise<GiftCardTransaction | null>;
    create(req: any, data: CreateGiftCardTransactionDto): Promise<GiftCardTransaction>;
    update(dto: UpdateGiftCardTransactionDto): Promise<[number, GiftCardTransaction[]]>;
    remove(req: any, id: string): Promise<number>;
    updateStatus(req: any, dto: UpdateGiftCardTransactionStatusDto): Promise<[number, GiftCardTransaction[]]>;
}
