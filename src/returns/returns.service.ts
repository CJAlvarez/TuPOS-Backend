import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
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
import { Inventory } from 'src/entities/inventory.entity';

@Injectable()
export class ReturnsService {
  constructor(
    @InjectModel(Return) private readonly returnModel: typeof Return,
    @InjectModel(SaleItem) private readonly saleItemModel: typeof SaleItem,
    @InjectModel(ReturnItem)
    private readonly returnItemModel: typeof ReturnItem,
    @InjectModel(Inventory)
    private readonly inventoryModel: typeof Inventory,
    private readonly utilsService: UtilsService,
    private readonly sequelize: Sequelize,
  ) {}

  async create(
    dto: CreateReturnDto,
    internal_user_id: number,
    internal_store_id: number,
  ) {
    this.validateReturnItems(dto);

    const transaction = await this.sequelize.transaction();

    try {
      const returns = await this.createReturnEntity(dto, internal_user_id, internal_store_id, transaction);
      const payload = this.buildReturnItemsPayload(dto, returns.getDataValue('id'));

      await this.returnItemModel.bulkCreate(payload, { transaction });

      await this.restoreInventoryForReturnItems(payload, dto.id_sale, internal_store_id, internal_user_id, transaction);

      await transaction.commit();
      return returns;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async findAll(query: GetReturnsQueryDto, id_store?: number) {
    const { search_word, limit = 10, skip = 0, id_sale } = query;
    const where: any = {};
    if (id_store) where.id_store = id_store;
    where.deleted_at = { [Op.is]: null };
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
          attributes: ['id', 'id_product', 'id_sale_item'],
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

    if (id_sale && insert) {
      const returnedSaleItems = await this.returnItemModel.findAll({
        attributes: ['id_sale_item'],
        where: {
          deleted_at: { [Op.is]: null },
        },
        include: [
          {
            model: Return,
            required: true,
            attributes: [],
            where: {
              id_sale,
              deleted_at: { [Op.is]: null },
            },
          },
        ],
        raw: true,
      });

      const returnedSaleItemIds = returnedSaleItems
        .map((item: any) => item.id_sale_item)
        .filter((id: any) => !!id);

      if (returnedSaleItemIds.length) {
        where.id = { [Op.notIn]: returnedSaleItemIds };
      }
    }

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

  async remove(internal_user_id: number, id: number): Promise<any> {
    await this.returnModel.update(
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
    return { title: 'Operación exitosa' };
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

  private validateReturnItems(dto: CreateReturnDto) {
    if (!Array.isArray(dto.return_items) || dto.return_items.length === 0) {
      throw new BadRequestException('Debe seleccionar al menos un producto para la devolucion');
    }
  }

  private async createReturnEntity(
    dto: CreateReturnDto,
    internal_user_id: number,
    internal_store_id: number,
    transaction: any,
  ) {
    const date = new Date(dto.date);
    return this.returnModel.create(
      {
        ...dto,
        date,
        created_by: internal_user_id,
        id_store: internal_store_id,
      } as any,
      { transaction },
    );
  }

  private buildReturnItemsPayload(dto: CreateReturnDto, idReturn: number) {
    return dto.return_items.map((item) => {
      const matched = dto._return_items?.find((i) => i?.id_product === item || i?.id === item);
      const id_sale_item = matched?.id ?? item;
      const id_product = matched?.id_product ?? item;

      if (!id_sale_item || !id_product) {
        throw new BadRequestException(`No se pudo resolver el item de venta para el producto/item ${item}`);
      }

      return {
        id_return: idReturn,
        id_product,
        id_sale_item,
      } as any;
    });
  }

  private async getSaleItemsMapForReturnItems(payload: any[], idSale: number, transaction: any) {
    const saleItemIds = payload.map((item) => item.id_sale_item);
    const saleItems = await this.saleItemModel.findAll({
      where: {
        id: { [Op.in]: saleItemIds },
        id_sale: idSale,
      },
      transaction,
    });

    const saleItemsMap = new Map<number, SaleItem>();
    saleItems.forEach((item) => saleItemsMap.set(item.getDataValue('id'), item));
    return saleItemsMap;
  }

  private async restoreInventoryForReturnItems(
    payload: any[],
    idSale: number,
    internal_store_id: number,
    internal_user_id: number,
    transaction: any,
  ) {
    const saleItemsMap = await this.getSaleItemsMapForReturnItems(payload, idSale, transaction);

    for (const item of payload) {
      const saleItem = saleItemsMap.get(item.id_sale_item);
      if (!saleItem) {
        throw new BadRequestException(
          `El item de venta ${item.id_sale_item} no pertenece a la venta ${idSale}`,
        );
      }

      const quantityToRestore = Number(saleItem.getDataValue('quantity') || 0);
      if (!quantityToRestore) continue;

      const idInventory = saleItem.getDataValue('id_inventory');

      if (idInventory) {
        await this.restoreToLinkedInventory(
          idInventory,
          internal_store_id,
          item.id_product,
          quantityToRestore,
          internal_user_id,
          transaction,
        );
      } else {
        await this.restoreToEachInventory(
          internal_store_id,
          item.id_product,
          quantityToRestore,
          internal_user_id,
          transaction,
        );
      }
    }
  }

  private async restoreToLinkedInventory(
    idInventory: number,
    idStore: number,
    idProduct: number,
    quantityToRestore: number,
    createdBy: number,
    transaction: any,
  ) {
    const inventory = await this.inventoryModel.findOne({
      where: {
        id: idInventory,
        id_store: idStore,
        id_product: idProduct,
      },
      transaction,
    });

    if (inventory) {
      await inventory.update(
        {
          unit_quantity: Number(inventory.getDataValue('unit_quantity') || 0) + quantityToRestore,
        },
        { transaction },
      );
      return;
    }

    await this.createInventoryRecord(
      idStore,
      idProduct,
      quantityToRestore,
      createdBy,
      transaction,
    );
  }

  private async restoreToEachInventory(
    idStore: number,
    idProduct: number,
    quantityToRestore: number,
    createdBy: number,
    transaction: any,
  ) {
    const inventories = await this.inventoryModel.findAll({
      where: {
        id_store: idStore,
        id_product: idProduct,
      },
      transaction,
    });

    if (!inventories.length) {
      await this.createInventoryRecord(
        idStore,
        idProduct,
        quantityToRestore,
        createdBy,
        transaction,
      );
      return;
    }

    for (const inventory of inventories) {
      await inventory.update(
        {
          unit_quantity: Number(inventory.getDataValue('unit_quantity') || 0) + quantityToRestore,
        },
        { transaction },
      );
    }
  }

  private async createInventoryRecord(
    idStore: number,
    idProduct: number,
    quantityToRestore: number,
    createdBy: number,
    transaction: any,
  ) {
    await this.inventoryModel.create(
      {
        id_store: idStore,
        id_product: idProduct,
        unit_quantity: quantityToRestore,
        created_by: createdBy,
      } as any,
      { transaction },
    );
  }
}
