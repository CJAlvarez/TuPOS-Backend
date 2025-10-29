import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SaleItem } from '../entities/sale-item.entity';
import { CreateSaleItemDto } from './dto/create-sale-item.dto';
import { UpdateSaleItemDto } from './dto/update-sale-item.dto';
import { GetSaleItemsQueryDto } from './dto/get-sale-items-query.dto';
import { UpdateSaleItemStatusDto } from './dto/update-sale-item-status.dto';
import { Op } from 'sequelize';
import { UtilsService } from 'src/utils/utils.service';
import { Product } from 'src/entities/product.entity';

@Injectable()
export class SaleItemService {
  constructor(
    @InjectModel(SaleItem)
    private readonly saleItemModel: typeof SaleItem,
    private readonly utilsService: UtilsService,
  ) {}

  async findAll(query: GetSaleItemsQueryDto, id_store?: number) {
    const { search_word, limit = 10, skip = 0, id_sale } = query;
    const where: any = {};
    
    if (id_store) {
      where.id_store = id_store;
    }
    
    if (id_sale) where.id_sale = id_sale;
    if (search_word) {
      where[Op.or] = [{ $price$: { [Op.like]: `%${search_word}%` } }];
    }
    const total = await this.saleItemModel.count({ where });
    const paginate = this.utilsService.paginate(limit, skip, total, false);
    const rows = await this.saleItemModel.findAll({
      where,
      limit: paginate.limit,
      offset: paginate.offset,
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['name', 'code'],
        },
      ],
    });
    return {
      count: total,
      list: rows.map((row) => row.toJSON()),
      skip: paginate.skip,
    };
  }

  async findOne(id: number): Promise<SaleItem | null> {
    return this.saleItemModel.findOne({ where: { id } });
  }

  async create(
    internal_user_id: number,
    internal_store_id: number,
    dto: CreateSaleItemDto,
  ): Promise<SaleItem> {
    dto.created_by = internal_user_id;
    dto.id_store = internal_store_id;
    return this.saleItemModel.create(dto as any);
  }

  async update(dto: UpdateSaleItemDto): Promise<[number, SaleItem[]]> {
    return this.saleItemModel.update(dto, {
      where: { id: dto.id },
      returning: true,
    });
  }

  async remove(internal_user_id: number, id: number): Promise<number> {
    const [affectedRows] = await this.saleItemModel.update(
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
    dto: UpdateSaleItemStatusDto,
  ): Promise<[number, SaleItem[]]> {
    return this.saleItemModel.update(
      {
        disabled_at: dto.enable ? null : new Date(),
        disabled_by: dto.enable ? null : internal_user_id,
      },
      { where: { id: dto.id }, returning: true },
    );
  }
}
