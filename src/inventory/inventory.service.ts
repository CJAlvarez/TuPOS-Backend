import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Inventory } from '../entities/inventory.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { GetInventoryQueryDto } from './dto/get-inventory-query.dto';
import { Op } from 'sequelize';
import { UtilsService } from 'src/utils/utils.service';
import { Sequelize } from 'sequelize-typescript';
import { Product } from 'src/entities/product.entity';
import * as mathTools from 'src/utils/math-tools';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory)
    private readonly inventoryModel: typeof Inventory,
    @InjectModel(Product)
    private readonly productModel: typeof Product,
    private readonly utilsService: UtilsService,
    private readonly sequelize: Sequelize,
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
    // if (search_word) {
    //   where[Op.or] = [
    //     { $code$: { [Op.like]: `%${search_word}%` } },
    //   ];
    // }
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

  async update(dto: UpdateInventoryDto): Promise<[number, Inventory[]]> {
    return this.inventoryModel.update(dto, {
      where: { id: dto.id },
      returning: true,
    });
  }

  async remove(internal_user_id: number, id: number): Promise<number> {
    return this.inventoryModel.destroy({ where: { id } });
  }

  async handleStock(item, transaction) {
    const product = await this.productModel.findByPk(item.id_product, {
      transaction,
    });

    if (!product) {
      throw new BadRequestException(
        `Producto ${item.id_product} no encontrado`,
      );
    }

    const unitsToDeduct = this.calculateUnits(item, product);

    const inventories = await this.getAvailableInventories(
      item.id_product,
      transaction,
    );

    this.validateStock(
      inventories,
      unitsToDeduct,
      product.getDataValue('name'),
    );

    await this.applyFifo(inventories, unitsToDeduct, transaction);
  }

  private calculateUnits(item, product) {
    if (item.sale_type === 'box' && product.getDataValue('box_amount')) {
      return mathTools.mul(item.quantity, product.getDataValue('box_amount'));
    }
    return item.quantity;
  }

  private async getAvailableInventories(productId, transaction) {
    return this.inventoryModel.findAll({
      where: {
        id_product: productId,
        unit_quantity: { [Op.gt]: 0 },
        [Op.or]: [
          { expiration_date: { [Op.gte]: new Date() } },
          { expiration_date: { [Op.eq]: null } },
        ],
      },
      order: [
        ['expiration_date', 'ASC'],
        ['created_at', 'ASC'],
      ],
      transaction,
    });
  }

  private validateStock(inventories, required, productName) {
    const total = inventories.reduce(
      (sum, i) => mathTools.add(sum, i.getDataValue('unit_quantity')),
      0,
    );

    if (required > total) {
      throw new BadRequestException(
        `Stock insuficiente para ${productName}. Disponible: ${total}`,
      );
    }
  }

  private async applyFifo(inventories, quantity, transaction) {
    let remaining = quantity;

    const updates: { id: number; newQty: number }[] = [];

    for (const inv of inventories) {
      if (remaining <= 0) break;

      const current = inv.getDataValue('unit_quantity');
      const take = Math.min(current, remaining);

      updates.push({
        id: inv.getDataValue('id'),
        newQty: current - take,
      });

      remaining -= take;
    }

    if (!updates.length) return;

    await this.bulkUpdateInventories(updates, transaction);
  }

  private async bulkUpdateInventories(updates, transaction) {
    const ids = updates.map((u) => u.id);

    const cases = updates.map((u) => `WHEN ${u.id} THEN ${u.newQty}`).join(' ');

    const sql = `
    UPDATE inventorys
    SET unit_quantity = CASE id
      ${cases}
    END
    WHERE id IN (${ids.join(',')})
  `;

    await this.sequelize.query(sql, { transaction });
  }
}
