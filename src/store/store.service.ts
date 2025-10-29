import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Store } from '../entities/store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { GetStoresQueryDto } from './dto/get-stores-query.dto';
import { UpdateStoreStatusDto } from './dto/update-store-status.dto';
import { Op } from 'sequelize';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store)
    private readonly storeModel: typeof Store,
    private readonly utilsService: UtilsService,
  ) {}

  async findAll(query: GetStoresQueryDto) {
    const { search_word, limit = 10, skip = 0 } = query;
    const where: any = {};
    if (search_word) {
      where[Op.or] = [
        { $name$: { [Op.like]: `%${search_word}%` } },
        { $code$: { [Op.like]: `%${search_word}%` } },
        { $address$: { [Op.like]: `%${search_word}%` } },
        { $phone$: { [Op.like]: `%${search_word}%` } },
        { $email$: { [Op.like]: `%${search_word}%` } },
      ];
    }

    const total = await this.storeModel.count({ where });
    const paginate = this.utilsService.paginate(limit, skip, total, false);
    const rows = await this.storeModel.findAll({
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

  async findOne(id: number): Promise<Store | null> {
    return this.storeModel.findOne({ where: { id } });
  }

  async create(
    internal_user_id: number,
    dto: CreateStoreDto,
  ): Promise<Store> {
    dto.created_by = internal_user_id;
    return this.storeModel.create(dto as any);
  }

  async update(
    dto: UpdateStoreDto,
  ): Promise<[number, Store[]]> {
    return this.storeModel.update(dto, { where: { id: dto.id }, returning: true });
  }

  async remove(internal_user_id: number, id: number): Promise<number> {
    const [affectedRows] = await this.storeModel.update(
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
    dto: UpdateStoreStatusDto,
  ): Promise<[number, Store[]]> {
    return this.storeModel.update(
      {
        disabled_at: dto.enable ? null : new Date(),
        disabled_by: dto.enable ? null : internal_user_id,
      },
      { where: { id: dto.id }, returning: true },
    );
  }
}
