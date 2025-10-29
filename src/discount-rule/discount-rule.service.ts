import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DiscountRule } from '../entities/discount-rule.entity';
import { CreateDiscountRuleDto } from './dto/create-discount-rule.dto';
import { UpdateDiscountRuleDto } from './dto/update-discount-rule.dto';
import { GetDiscountRulesQueryDto } from './dto/get-discount-rules-query.dto';
import { UpdateDiscountRuleStatusDto } from './dto/update-discount-rule-status.dto';
import { Op } from 'sequelize';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class DiscountRuleService {
  constructor(
    @InjectModel(DiscountRule)
    private readonly discountRuleModel: typeof DiscountRule,
    private readonly utilsService: UtilsService,
  ) {}

  async findAll(query: GetDiscountRulesQueryDto, id_store?: number) {
    const { search_word, limit = 10, skip = 0 } = query;
    const where: any = {};
    if (id_store) where.id_store = id_store;
    if (search_word) {
      where[Op.or] = [
        { $id$: { [Op.like]: `%${search_word}%` } },
        { $name$: { [Op.like]: `%${search_word}%` } },
      ];
    }
    const total = await this.discountRuleModel.count({ where });
    const paginate = this.utilsService.paginate(limit, skip, total, false);
    const rows = await this.discountRuleModel.findAll({
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

  async findOne(id: number): Promise<DiscountRule | null> {
    return this.discountRuleModel.findOne({ where: { id } });
  }

  async create(
    internal_user_id: number,
    internal_store_id: number,
    dto: CreateDiscountRuleDto,
  ): Promise<DiscountRule> {
    dto.created_by = internal_user_id;
    dto.id_store = internal_store_id;
    return this.discountRuleModel.create(dto as any);
  }

  async update(
    dto: UpdateDiscountRuleDto,
  ): Promise<[number, DiscountRule[]]> {
    return this.discountRuleModel.update(dto, { where: { id: dto.id }, returning: true });
  }

  async remove(internal_user_id: number, id: number): Promise<number> {
    const [affectedRows] = await this.discountRuleModel.update(
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
    dto: UpdateDiscountRuleStatusDto,
  ): Promise<[number, DiscountRule[]]> {
    return this.discountRuleModel.update(
      {
        disabled_at: dto.enable ? null : new Date(),
        disabled_by: dto.enable ? null : internal_user_id,
      },
      { where: { id: dto.id }, returning: true },
    );
  }
}