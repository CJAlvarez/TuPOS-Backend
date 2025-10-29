import { GiftCard } from '../entities/gift-card.entity';
import { CreateGiftCardDto } from './dto/create-gift-card.dto';
import { UpdateGiftCardDto } from './dto/update-gift-card.dto';
import { GetGiftCardsQueryDto } from './dto/get-gift-cards-query.dto';
import { UpdateGiftCardStatusDto } from './dto/update-gift-card-status.dto';
import { UtilsService } from 'src/utils/utils.service';
export declare class GiftCardService {
    private readonly giftCardModel;
    private readonly utilsService;
    constructor(giftCardModel: typeof GiftCard, utilsService: UtilsService);
    findAll(query: GetGiftCardsQueryDto, id_store?: number): Promise<{
        count: number;
        list: GiftCard[];
        skip: number;
    }>;
    findOne(id: number): Promise<GiftCard | null>;
    create(internal_user_id: number, internal_store_id: number, dto: CreateGiftCardDto): Promise<GiftCard>;
    update(dto: UpdateGiftCardDto): Promise<[number, GiftCard[]]>;
    remove(internal_user_id: number, id: number): Promise<number>;
    updateStatus(internal_user_id: number, dto: UpdateGiftCardStatusDto): Promise<[number, GiftCard[]]>;
}
