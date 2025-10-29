import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Return } from '../entities/return.entity';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';
import { GetReturnsQueryDto } from './dto/get-returns-query.dto';
import { UpdateReturnStatusDto } from './dto/update-return-status.dto';
import { UtilsService } from '../utils/utils.service';
import { GetProductsQueryDto } from './dto/get-products-query.dto';
import { SaleItem } from 'src/entities/sale-item.entity';
import { Product } from 'src/entities/product.entity';
import { ReturnItem } from 'src/entities/return-item.entity';

@Injectable()
export class ReturnsService {
  constructor(
    @InjectModel(Return) private readonly returnModel: typeof Return,
    @InjectModel(SaleItem) private readonly saleItemModel: typeof SaleItem,
    @InjectModel(ReturnItem)
    private readonly returnItemModel: typeof ReturnItem,
    private readonly utilsService: UtilsService,
  ) {}

  async create(dto: CreateReturnDto, internal_user_id: number, internal_store_id: number) {
    const date = new Date(dto.date);
    const returns = await this.returnModel.create({
      ...dto,
      date,
      created_by: internal_user_id,
      id_store: internal_store_id,
    } as any);

    this.returnItemModel.bulkCreate(
      dto.return_items.map(
        (item) =>
          ({
            id_return: returns.getDataValue('id'),
            id_product: item,
            id_sale_item:
              dto._return_items.find((i) => i.id_product === item)?.id || null,
          }) as any,
      ),
    );

    return returns;
  }

  async findAll(query: GetReturnsQueryDto, id_store?: number) {
    const { search_word, limit = 10, skip = 0, id_sale } = query;
    const where: any = {};
    if (id_store) where.id_store = id_store;
    if (id_sale) where.id_sale = id_sale;
    if (search_word) {
      where[Op.or] = [
        { reason: { [Op.like]: `%${search_word}%` } },
        { status: { [Op.like]: `%${search_word}%` } },
      ];
    }

    where.deleted_at = { [Op.is]: null };

    const total = await this.returnModel.count({ where });
    const paginate = this.utilsService.paginate(limit, skip, total, false);
    const rows = await this.returnModel.findAll({
      where,
      limit: paginate.limit,
      offset: paginate.offset,
      order: [['id', 'DESC']],
      include: [
        {
          model: ReturnItem,
          required: false,
          as: 'return_items',
          attributes: ['id', 'id_product'],
        },
      ],
    });

    return {
      count: total,
      list: rows.map((row) => row.toJSON()),
      skip: paginate.skip,
    };
  }

  async getProducts(query: GetProductsQueryDto) {
    const { id_sale, insert } = query;
    const where: any = {};
    if (id_sale) where.id_sale = id_sale;
    if (!insert) where.deleted_at = { [Op.is]: null };
    const rows = await this.saleItemModel.findAll({
      where,
      order: [['id', 'ASC']],
      include: [
        {
          model: Product,
          required: true,
          as: 'product',
          attributes: ['id', 'name', 'code'],
        },
      ],
      raw: true,
    });
    return rows;
  }

  async findOne(id: number) {
    const item = await this.returnModel.findOne({
      where: {
        id,
        deleted_at: { [Op.is]: null },
      },
    });
    if (!item) throw new NotFoundException('Return not found');
    return item;
  }

  async update(dto: UpdateReturnDto, internal_user_id: number) {
    const date = new Date(dto.date);
    const [affectedRows, [updated]] = await this.returnModel.update(
      { ...dto, date },
      {
        where: {
          id: dto.id,
          deleted_at: { [Op.is]: null },
        },
        returning: true,
      },
    );
    if (!affectedRows) throw new NotFoundException('Return not found');
    return updated;
  }

  async remove(internal_user_id: number, id: number): Promise<number> {
    const [affectedRows] = await this.returnModel.update(
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
    dto: UpdateReturnStatusDto,
  ): Promise<[number, Return[]]> {
    return this.returnModel.update(
      {
        disabled_at: dto.enable ? null : new Date(),
        disabled_by: dto.enable ? null : internal_user_id,
      } as any,
      { where: { id: dto.id }, returning: true },
    );
  }
}
