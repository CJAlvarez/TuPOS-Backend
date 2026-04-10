import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GiftCard } from '../entities/gift-card.entity';
import { CreateGiftCardDto } from './dto/create-gift-card.dto';
import { UpdateGiftCardDto } from './dto/update-gift-card.dto';
import { GetGiftCardsQueryDto } from './dto/get-gift-cards-query.dto';
import { UpdateGiftCardStatusDto } from './dto/update-gift-card-status.dto';
import { Op } from 'sequelize';
import { UtilsService } from 'src/utils/utils.service';
import * as mathTools from 'src/utils/math-tools';
import { GiftCardTransaction } from 'src/entities/gift-card-transaction.entity';

@Injectable()
export class GiftCardService {
  constructor(
    @InjectModel(GiftCard)
    private readonly giftCardModel: typeof GiftCard,
    @InjectModel(GiftCardTransaction)
    private readonly giftCardTransactionModel: typeof GiftCardTransaction,
    private readonly utilsService: UtilsService,
  ) {}

  async findAll(query: GetGiftCardsQueryDto, id_store?: number) {
    const { search_word, limit = 10, skip = 0 } = query;
    const where: any = {};
    if (id_store) where.id_store = id_store;

    where.deleted_at = { [Op.is]: null };

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

  async remove(internal_user_id: number, id: number): Promise<any> {
    await this.giftCardModel.update(
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
    return { title: 'Operación exitosa' };
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

  async processGiftCards(giftCards, sale, userId, storeId, transaction) {
    if (!giftCards?.length) return;

    for (const gc of giftCards) {
      const giftCard = await this.giftCardModel.findByPk(gc.id_gift_card, {
        transaction,
      });

      if (!giftCard) {
        throw new BadRequestException(
          `GiftCard ${gc.id_gift_card} no encontrada`,
        );
      }

      const balance = Number(giftCard.getDataValue('current_balance'));

      if (balance < gc.amount_used) {
        throw new BadRequestException(`Saldo insuficiente`);
      }

      const newBalance = mathTools.sub(balance, gc.amount_used);

      await giftCard.update({ current_balance: newBalance }, { transaction });

      await this.giftCardTransactionModel.create(
        {
          id_gift_card: giftCard.getDataValue('id'),
          id_sale: sale.id,
          id_store: storeId,
          amount: gc.amount_used,
          id_type: 2,
          created_by: userId,
        } as any,
        { transaction },
      );
    }
  }
}
