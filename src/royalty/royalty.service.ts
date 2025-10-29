import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Royalty } from '../entities/royalty.entity';
import { CreateRoyaltyDto } from './dto/create-royalty.dto';
import { UpdateRoyaltyDto } from './dto/update-royalty.dto';
import { GetRoyaltiesQueryDto } from './dto/get-royalties-query.dto';
import { UpdateRoyaltyStatusDto } from './dto/update-royalty-status.dto';
import { Op } from 'sequelize';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class RoyaltyService {
  constructor(
    @InjectModel(Royalty)
    private readonly royaltyModel: typeof Royalty,
    private readonly utilsService: UtilsService,
  ) {}

  async findAll(query: GetRoyaltiesQueryDto, id_store?: number) {
    const { search_word, limit = 10, skip = 0, id_client } = query;
    const where: any = {};
    if (id_store) where.id_store = id_store;
    if (id_client) where.id_client = id_client;
    if (search_word) {
      where[Op.or] = [
        { $id$: { [Op.like]: `%${search_word}%` } },
        { $points$: { [Op.like]: `%${search_word}%` } },
      ];
    }
    const total = await this.royaltyModel.count({ where });
    const paginate = this.utilsService.paginate(limit, skip, total, false);
    const rows = await this.royaltyModel.findAll({
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

  async findOne(id: number): Promise<Royalty | null> {
    return this.royaltyModel.findOne({ where: { id } });
  }

  async create(
    internal_user_id: number,
    internal_store_id: number,
    dto: CreateRoyaltyDto,
  ): Promise<Royalty> {
    dto.created_by = internal_user_id;
    dto.id_store = internal_store_id;
    return this.royaltyModel.create(dto as any);
  }

  async update(dto: UpdateRoyaltyDto): Promise<[number, Royalty[]]> {
    return this.royaltyModel.update(dto, {
      where: { id: dto.id },
      returning: true,
    });
  }

  async remove(internal_user_id: number, id: number): Promise<number> {
    const [affectedRows] = await this.royaltyModel.update(
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
    dto: UpdateRoyaltyStatusDto,
  ): Promise<[number, Royalty[]]> {
    return this.royaltyModel.update(
      {
        disabled_at: dto.enable ? null : new Date(),
        disabled_by: dto.enable ? null : internal_user_id,
      },
      { where: { id: dto.id }, returning: true },
    );
  }
}
