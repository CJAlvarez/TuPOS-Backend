import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Campaign } from '../entities/campaign.entity';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { GetCampaignsQueryDto } from './dto/get-campaigns-query.dto';
import { UpdateCampaignStatusDto } from './dto/update-campaign-status.dto';
import { Op } from 'sequelize';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class CampaignService {
  constructor(
    @InjectModel(Campaign)
    private readonly campaignModel: typeof Campaign,
    private readonly utilsService: UtilsService,
  ) {}

  async findAll(query: GetCampaignsQueryDto, id_store?: number) {
    const { search_word, limit = 10, skip = 0 } = query;
    const where: any = {};
    if (id_store) where.id_store = id_store;
    if (search_word) {
      where[Op.or] = [
        { $id$: { [Op.like]: `%${search_word}%` } },
        { $name$: { [Op.like]: `%${search_word}%` } },
      ];
    }
    const total = await this.campaignModel.count({ where });
    const paginate = this.utilsService.paginate(limit, skip, total, false);
    const rows = await this.campaignModel.findAll({
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

  async findOne(id: number): Promise<Campaign | null> {
    return this.campaignModel.findOne({ where: { id } });
  }

  async create(
    internal_user_id: number,
    internal_store_id: number,
    dto: CreateCampaignDto,
  ): Promise<Campaign> {
    dto.created_by = internal_user_id;
    dto.id_store = internal_store_id;
    return this.campaignModel.create(dto as any);
  }

  async update(
    dto: UpdateCampaignDto,
  ): Promise<[number, Campaign[]]> {
    return this.campaignModel.update(dto, { where: { id: dto.id }, returning: true });
  }

  async remove(internal_user_id: number, id: number): Promise<number> {
    const [affectedRows] = await this.campaignModel.update(
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
    dto: UpdateCampaignStatusDto,
  ): Promise<[number, Campaign[]]> {
    return this.campaignModel.update(
      {
        disabled_at: dto.enable ? null : new Date(),
        disabled_by: dto.enable ? null : internal_user_id,
      },
      { where: { id: dto.id }, returning: true },
    );
  }
}