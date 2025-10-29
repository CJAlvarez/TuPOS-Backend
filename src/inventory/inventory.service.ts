import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Inventory } from '../entities/inventory.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { GetInventoryQueryDto } from './dto/get-inventory-query.dto';
import { Op } from 'sequelize';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory)
    private readonly inventoryModel: typeof Inventory,
    private readonly utilsService: UtilsService,
  ) {}

  async findAll(query: GetInventoryQueryDto, id_store?: number) {
    const { search_word, limit = 10, skip = 0 } = query;
    const where: any = {};
    
    if (id_store) {
      where.id_store = id_store;
    }
    
    if (query.id_product) {
      where.id_product = query.id_product;
    }
    if (search_word) {
      where[Op.or] = [
        { $code$: { [Op.like]: `%${search_word}%` } },
      ];
    }
    const total = await this.inventoryModel.count({ where });
    const paginate = this.utilsService.paginate(limit, skip, total, false);
    const rows = await this.inventoryModel.findAll({
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

  async findOne(id: number): Promise<Inventory | null> {
    return this.inventoryModel.findOne({ where: { id } });
  }

  async create(
    internal_user_id: number,
    internal_store_id: number,
    dto: CreateInventoryDto,
  ): Promise<Inventory> {
    dto.created_by = internal_user_id;
    dto.id_store = internal_store_id;
    return this.inventoryModel.create(dto as any);
  }

  async update(
    dto: UpdateInventoryDto,
  ): Promise<[number, Inventory[]]> {
    return this.inventoryModel.update(dto, { where: { id: dto.id }, returning: true });
  }

  async remove(internal_user_id: number, id: number): Promise<number> {
    return this.inventoryModel.destroy({ where: { id } });
  }
}
