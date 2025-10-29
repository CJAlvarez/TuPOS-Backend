import { CreateGiftCardDto } from './dto/create-gift-card.dto';
import { UpdateGiftCardDto } from './dto/update-gift-card.dto';
import { GetGiftCardsQueryDto } from './dto/get-gift-cards-query.dto';
import { UpdateGiftCardStatusDto } from './dto/update-gift-card-status.dto';
import { GiftCard } from '../entities/gift-card.entity';
import { GiftCardService } from './gift-card.service';
export declare class GiftCardController {
    private readonly giftCardService;
    constructor(giftCardService: GiftCardService);
    findAll(req: any, query: GetGiftCardsQueryDto): Promise<any>;
    findOne(id: string): Promise<GiftCard | null>;
    create(req: any, data: CreateGiftCardDto): Promise<GiftCard>;
    update(dto: UpdateGiftCardDto): Promise<[number, GiftCard[]]>;
    remove(req: any, id: string): Promise<number>;
    updateStatus(req: any, dto: UpdateGiftCardStatusDto): Promise<[number, GiftCard[]]>;
}
