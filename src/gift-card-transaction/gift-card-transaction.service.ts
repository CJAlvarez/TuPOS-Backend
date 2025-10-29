import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GiftCardTransaction } from '../entities/gift-card-transaction.entity';
import { CreateGiftCardTransactionDto } from './dto/create-gift-card-transaction.dto';
import { UpdateGiftCardTransactionDto } from './dto/update-gift-card-transaction.dto';
import { GetGiftCardTransactionsQueryDto } from './dto/get-gift-card-transactions-query.dto';
import { UpdateGiftCardTransactionStatusDto } from './dto/update-gift-card-transaction-status.dto';
import { Op } from 'sequelize';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class GiftCardTransactionService {
  constructor(
    @InjectModel(GiftCardTransaction)
    private readonly giftCardTransactionModel: typeof GiftCardTransaction,
    private readonly utilsService: UtilsService,
  ) {}

  async findAll(query: GetGiftCardTransactionsQueryDto, id_store?: number) {
    const { search_word, limit = 10, skip = 0 } = query;
    const where: any = {};
    if (id_store) where.id_store = id_store;
    if (search_word) {
      where[Op.or] = [
        { $id$: { [Op.like]: `%${search_word}%` } },
        { $id_gift_card$: { [Op.like]: `%${search_word}%` } },
      ];
    }
    const total = await this.giftCardTransactionModel.count({ where });
    const paginate = this.utilsService.paginate(limit, skip, total, false);
    const rows = await this.giftCardTransactionModel.findAll({
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

  async findOne(id: number): Promise<GiftCardTransaction | null> {
    return this.giftCardTransactionModel.findOne({ where: { id } });
  }

  async create(
    internal_user_id: number,
    internal_store_id: number,
    dto: CreateGiftCardTransactionDto,
  ): Promise<GiftCardTransaction> {
    dto.created_by = internal_user_id;
    dto.id_store = internal_store_id;
    return this.giftCardTransactionModel.create(dto as any);
  }

  async update(
    dto: UpdateGiftCardTransactionDto,
  ): Promise<[number, GiftCardTransaction[]]> {
    return this.giftCardTransactionModel.update(dto, { where: { id: dto.id }, returning: true });
  }

  async remove(internal_user_id: number, id: number): Promise<number> {
    const [affectedRows] = await this.giftCardTransactionModel.update(
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
    dto: UpdateGiftCardTransactionStatusDto,
  ): Promise<[number, GiftCardTransaction[]]> {
    return this.giftCardTransactionModel.update(
      {
        disabled_at: dto.enable ? null : new Date(),
        disabled_by: dto.enable ? null : internal_user_id,
      },
      { where: { id: dto.id }, returning: true },
    );
  }
}