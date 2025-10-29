import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../entities/product.entity';
import { UpdateProductStatusDto } from './dto/update-product-status.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Op } from 'sequelize';
import { UtilsService } from 'src/utils/utils.service';
import { GetProductsQueryDto } from './dto/get-products-query.dto';
import { Inventory } from 'src/entities/inventory.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private readonly productModel: typeof Product,
    private readonly utilsService: UtilsService,
  ) {}

  async findAll(query: GetProductsQueryDto, id_store?: number) {
    const { search_word, limit = 10, skip = 0 } = query;

    const where: any = {};
    if (id_store) where.id_store = id_store;
    if (search_word) {
      where[Op.or] = [
        { $name$: { [Op.like]: `%${search_word}%` } },
        { $code$: { [Op.like]: `%${search_word}%` } },
        { $category$: { [Op.like]: `%${search_word}%` } },
      ];
    }

    const total = await this.productModel.count({
      where,
    });
    const paginate = this.utilsService.paginate(limit, skip, total, false);
    const rows = await this.productModel.findAll({
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

  async getProductsPOS(query: GetProductsQueryDto, id_store?: number) {
    const { search_word } = query;
    const where: any = {
      disabled_at: { [Op.is]: null },
    };
    if (id_store) where.id_store = id_store;
    if (search_word) {
      where[Op.or] = [
        { $name$: { [Op.like]: `%${search_word}%` } },
        { $code$: { [Op.like]: `%${search_word}%` } },
        { $category$: { [Op.like]: `%${search_word}%` } },
      ];
    }
    const rows = await this.productModel.findAll({
      where,
      include: [
        {
          model: Inventory,
          as: 'inventorys',
          // where: { unit_quantity: { [Op.gt]: 0 } },
          order: [['expiration_date', 'DESC']],
          attributes: ['id', 'id_product', 'unit_quantity'],
        },
      ],
    });
    return {
      count: rows.length,
      list: rows.map((row) => row.toJSON()),
      skip: 0,
    };
  }

  async findOne(id: number): Promise<Product | null> {
    return this.productModel.findOne({
      where: {
        id,
        deleted_at: { [Op.is]: null },
      },
    });
  }

  async create(
    internal_user_id: number,
    internal_store_id: number,
    dto: CreateProductDto,
  ): Promise<Product> {
    dto.created_by = internal_user_id;
    dto.id_store = internal_store_id;
    return this.productModel.create(dto as any);
  }

  async update(dto: UpdateProductDto): Promise<[number, Product[]]> {
    return this.productModel.update(dto, {
      where: { id: dto.id },
      returning: true,
    });
  }

  async remove(internal_user_id: number, id: number): Promise<number> {
    const [affectedRows] = await this.productModel.update(
      {
        deleted_at: new Date(),
        deleted_by: internal_user_id,
      },
      {
        where: {
          id,
          deleted_at: { [Op.not]: null },
        },
      },
    );
    return affectedRows;
  }

  async updateStatus(
    internal_user_id: number,
    dto: UpdateProductStatusDto,
  ): Promise<[number, Product[]]> {
    return this.productModel.update(
      {
        disabled_at: dto.enable ? null : new Date(),
        disabled_by: dto.enable ? null : internal_user_id,
      },
      { where: { id: dto.id }, returning: true },
    );
  }
}
