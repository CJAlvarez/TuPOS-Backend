import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cashbox } from '../entities/cashbox.entity';
import { CreateCashboxDto } from './dto/create-cashbox.dto';
import { UpdateCashboxDto } from './dto/update-cashbox.dto';
import { GetCashboxesQueryDto } from './dto/get-cashboxes-query.dto';
import { UpdateCashboxStatusDto } from './dto/update-cashbox-status.dto';
import { Op } from 'sequelize';
import { UtilsService } from 'src/utils/utils.service';
import { OpenCashboxDto } from './dto/open-cashbox.dto';
import { CloseCashboxDto } from './dto/close-cashbox.dto';

@Injectable()
export class CashboxService {
  constructor(
    @InjectModel(Cashbox)
    private readonly cashboxModel: typeof Cashbox,
    private readonly utilsService: UtilsService,
  ) {}

  async findAll(query: GetCashboxesQueryDto, id_store?: number) {
    const { search_word, limit = 10, skip = 0 } = query;
    const where: any = {};
    if (id_store) where.id_store = id_store;
    if (search_word) {
      where[Op.or] = [
        { $id$: { [Op.like]: `%${search_word}%` } },
        { $opening_amount$: { [Op.like]: `%${search_word}%` } },
      ];
    }
    const total = await this.cashboxModel.count({ where });
    const paginate = this.utilsService.paginate(limit, skip, total, false);
    const rows = await this.cashboxModel.findAll({
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

  async findOne(id: number): Promise<Cashbox | null> {
    return this.cashboxModel.findOne({ where: { id } });
  }

  async create(
    internal_user_id: number,
    internal_store_id: number,
    dto: CreateCashboxDto,
  ): Promise<Cashbox> {
    dto.created_by = internal_user_id;
    dto.id_store = internal_store_id;
    return this.cashboxModel.create(dto as any);
  }

  async update(dto: UpdateCashboxDto): Promise<[number, Cashbox[]]> {
    return this.cashboxModel.update(dto, {
      where: { id: dto.id },
      returning: true,
    });
  }

  async remove(internal_user_id: number, id: number): Promise<number> {
    const [affectedRows] = await this.cashboxModel.update(
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
    dto: UpdateCashboxStatusDto,
  ): Promise<[number, Cashbox[]]> {
    return this.cashboxModel.update(
      {
        disabled_at: dto.enable ? null : new Date(),
        disabled_by: dto.enable ? null : internal_user_id,
      },
      { where: { id: dto.id }, returning: true },
    );
  }

  async openCashbox(
    internal_user_id: number,
    dto: OpenCashboxDto,
  ): Promise<[number, Cashbox[]]> {
    return this.cashboxModel.update(
      {
        opened_at: new Date(),
        opened_by: internal_user_id,
      },
      { where: { id: dto.id }, returning: true },
    );
  }

  async closeCashbox(
    internal_user_id: number,
    dto: CloseCashboxDto,
  ): Promise<[number, Cashbox[]]> {
    return this.cashboxModel.update(
      {
        closed_at: new Date(),
        closed_by: internal_user_id,
      },
      { where: { id: dto.id }, returning: true },
    );
  }
}
