import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GiftCard } from '../entities/gift-card.entity';
import { CreateGiftCardDto } from './dto/create-gift-card.dto';
import { UpdateGiftCardDto } from './dto/update-gift-card.dto';
import { GetGiftCardsQueryDto } from './dto/get-gift-cards-query.dto';
import { UpdateGiftCardStatusDto } from './dto/update-gift-card-status.dto';
import { Op } from 'sequelize';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class GiftCardService {
  constructor(
    @InjectModel(GiftCard)
    private readonly giftCardModel: typeof GiftCard,
    private readonly utilsService: UtilsService,
  ) {}

  async findAll(query: GetGiftCardsQueryDto, id_store?: number) {
    const { search_word, limit = 10, skip = 0 } = query;
    const where: any = {};
    if (id_store) where.id_store = id_store;
    if (search_word) {
      where[Op.or] = [
        { $id$: { [Op.like]: `%${search_word}%` } },
        { $code$: { [Op.like]: `%${search_word}%` } },
      ];
    }
    const total = await this.giftCardModel.count({ where });
    const paginate = this.utilsService.paginate(limit, skip, total, false);
    const rows = await this.giftCardModel.findAll({
      where,
      limit: paginate.limit,
      offset: paginate.offset,
    });
    return {
      count: total,
      list: rows.map((row) => row.toJSON()),
      skip: paginate.skip,
    };
  }

  async findOne(id: number): Promise<GiftCard | null> {
    return this.giftCardModel.findOne({ where: { id } });
  }

  async create(
    internal_user_id: number,
    internal_store_id: number,
    dto: CreateGiftCardDto,
  ): Promise<GiftCard> {
    dto.created_by = internal_user_id;
    dto.id_store = internal_store_id;
    dto.current_balance = dto.initial_balance;
    
    // Convertir strings de fecha a objetos Date
    const giftCardData: any = { ...dto };
    if (dto.issued_at) {
      giftCardData.issued_at = new Date(dto.issued_at);
    }
    if (dto.expires_at) {
      giftCardData.expires_at = new Date(dto.expires_at);
    }
    
    return this.giftCardModel.create(giftCardData);
  }

  async update(dto: UpdateGiftCardDto): Promise<[number, GiftCard[]]> {
    dto.current_balance = dto.initial_balance;
    return this.giftCardModel.update(dto, {
      where: { id: dto.id },
      returning: true,
    });
  }

  async remove(internal_user_id: number, id: number): Promise<number> {
    const [affectedRows] = await this.giftCardModel.update(
      {
        deleted_at: new Date(),
        deleted_by: internal_user_id,
      },
      {
        where: {
          id,
          deleted_at: { [Op.is]: null },
        },
      },
    );
    return affectedRows;
  }

  async updateStatus(
    internal_user_id: number,
    dto: UpdateGiftCardStatusDto,
  ): Promise<[number, GiftCard[]]> {
    return this.giftCardModel.update(
      {
        disabled_at: dto.enable ? null : new Date(),
        disabled_by: dto.enable ? null : internal_user_id,
      },
      { where: { id: dto.id }, returning: true },
    );
  }
}
