import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ReturnItem } from '../entities/return-item.entity';
import { CreateReturnItemDto } from './dto/create-return-item.dto';
import { UpdateReturnItemDto } from './dto/update-return-item.dto';
import { GetReturnItemsQueryDto } from './dto/get-return-items-query.dto';
import { UpdateReturnItemStatusDto } from './dto/update-return-item-status.dto';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class ReturnItemsService {
  constructor(
    @InjectModel(ReturnItem)
    private readonly returnItemModel: typeof ReturnItem,
    private readonly utilsService: UtilsService,
  ) {}

  async create(dto: CreateReturnItemDto, internal_user_id: number) {
    return this.returnItemModel.create({ ...dto } as any);
  }

  async findAll(query: GetReturnItemsQueryDto) {
    const { limit = 10, skip = 0 } = query;
    const where: any = {};
    
    where.deleted_at = { [Op.is]: null };
    
    const total = await this.returnItemModel.count({ where });
    const paginate = this.utilsService.paginate(limit, skip, total, false);
    const rows = await this.returnItemModel.findAll({
      where,
      limit: paginate.limit,
      offset: paginate.offset,
      order: [['id', 'DESC']],
    });
    
    return {
      count: total,
      list: rows.map((row) => row.toJSON()),
      skip: paginate.skip,
    };
  }

  async findOne(id: number) {
    const item = await this.returnItemModel.findOne({
      where: {
        id,
        deleted_at: { [Op.is]: null },
      },
    });
    if (!item) throw new NotFoundException('Return item not found');
    return item;
  }

  async update(dto: UpdateReturnItemDto, internal_user_id: number) {
    const [affectedRows, [updated]] = await this.returnItemModel.update(
      { ...dto },
      {
        where: {
          id: dto.id,
          deleted_at: { [Op.is]: null },
        },
        returning: true,
      },
    );
    if (!affectedRows) throw new NotFoundException('Return item not found');
    return updated;
  }

  async remove(internal_user_id: number, id: number): Promise<number> {
    const [affectedRows] = await this.returnItemModel.update(
      {
        deleted_at: new Date(),
        deleted_by: internal_user_id,
      } as any,
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
    dto: UpdateReturnItemStatusDto,
  ): Promise<[number, ReturnItem[]]> {
    return this.returnItemModel.update(
      {
        disabled_at: dto.enable ? null : new Date(),
        disabled_by: dto.enable ? null : internal_user_id,
      } as any,
      { where: { id: dto.id }, returning: true },
    );
  }
}
