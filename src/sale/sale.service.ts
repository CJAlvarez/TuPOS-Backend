import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sale } from '../entities/sale.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { GetSalesQueryDto } from './dto/get-sales-query.dto';
import { UpdateSaleStatusDto } from './dto/update-sale-status.dto';
import { Op } from 'sequelize';
import { UtilsService } from 'src/utils/utils.service';
import { Sequelize } from 'sequelize-typescript';
import { RoyaltyService } from 'src/royalty/royalty.service';
import { GiftCardService } from 'src/gift-card/gift-card.service';
import { InventoryService } from 'src/inventory/inventory.service';
import { PaymentService } from 'src/payment/payment.service';
import { SaleItemService } from 'src/sale-item/sale-item.service';

@Injectable()
export class SaleService {
  constructor(
    @InjectModel(Sale)
    private readonly saleModel: typeof Sale,
    private readonly utilsService: UtilsService,
    private readonly royaltyService: RoyaltyService,
    private readonly giftCardService: GiftCardService,
    private readonly inventoryService: InventoryService,
    private readonly paymentService: PaymentService,
    private readonly saleItemService: SaleItemService,
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(query: GetSalesQueryDto, id_store?: number) {
    const { search_word, limit = 10, skip = 0 } = query;
    const where: any = {};

    if (id_store) {
      where.id_store = id_store;
    }

    where.deleted_at = { [Op.is]: null };

    if (search_word) {
      where[Op.or] = [
        { $id$: { [Op.like]: `%${search_word}%` } },
        { $total$: { [Op.like]: `%${search_word}%` } },
      ];
    }
    const total = await this.saleModel.count({ where });
    const paginate = this.utilsService.paginate(limit, skip, total, false);
    const rows = await this.saleModel.findAll({
      where,
      limit: paginate.limit,
      offset: paginate.offset,
      order: [['date', 'DESC']],
    });
    return {
      count: total,
      list: rows.map((row) => row.toJSON()),
      skip: paginate.skip,
    };
  }

  async findOne(id: number): Promise<Sale | null> {
    return this.saleModel.findOne({ where: { id } });
  }

  async create(
    internal_user_id: number,
    internal_store_id: number,
    dto: CreateSaleDto,
  ): Promise<Sale> {
    const transaction = await this.sequelize.transaction();

    try {
      dto.id_store = internal_store_id;

      const saleNumber = await this.generateNumber();

      const sale = await this.createSale(
        dto,
        saleNumber,
        internal_user_id,
        transaction,
      );

      await this.processItems(sale, dto.items, dto.id_store, transaction);

      await this.giftCardService.processGiftCards(
        dto.gift_cards,
        sale,
        internal_user_id,
        dto.id_store,
        transaction,
      );

      const royaltyResult = await this.royaltyService.processRoyalty(
        dto,
        transaction,
      );

      await this.royaltyService.generatePoints(
        dto.id_client,
        royaltyResult.moneyAmount,
        sale.id,
        internal_user_id,
        dto.id_store,
        transaction,
      );

      await this.paymentService.createPayment(
        dto,
        sale,
        dto.id_store,
        internal_user_id,
        royaltyResult,
        transaction,
      );

      await transaction.commit();
      return sale;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async update(dto: UpdateSaleDto): Promise<[number, Sale[]]> {
    return this.saleModel.update(dto as any, {
      where: { id: dto.id },
      returning: true,
    });
  }

  async remove(internal_user_id: number, id: number): Promise<any> {
    await this.saleModel.update(
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
    return { title: 'Operación exitosa' };
  }

  async updateStatus(
    internal_user_id: number,
    dto: UpdateSaleStatusDto,
  ): Promise<[number, Sale[]]> {
    return this.saleModel.update(
      {
        disabled_at: dto.enable ? null : new Date(),
        disabled_by: dto.enable ? null : internal_user_id,
      },
      { where: { id: dto.id }, returning: true },
    );
  }

  async createSale(dto, saleNumber, userId, transaction) {
    return this.saleModel.create(
      {
        id_client: dto.id_client || null,
        id_payment_method: dto.id_payment_method || 1,
        id_status: dto.id_status || 1,
        id_store: dto.id_store,
        number: saleNumber,
        subtotal: dto.subtotal,
        discount_total: dto.discount_total,
        tax_total: dto.tax_total,
        total: dto.total,
        date: dto.date || new Date(),
        notes: dto.notes || null,
        created_by: userId,
      } as any,
      { transaction },
    );
  }

  async processItems(sale, items, storeId, transaction) {
    if (!items?.length) return;

    for (const item of items) {
      await this.saleItemService.createCustom(
        sale.id,
        item,
        storeId,
        transaction,
      );

      await this.inventoryService.handleStock(item, transaction);
    }
  }

  async generateNumber(): Promise<string> {
    const lastSale = await this.saleModel.findOne({
      order: [['id', 'DESC']],
    });

    if (!lastSale || !lastSale.getDataValue('number')) {
      return 'V-00001';
    }

    // Extraer el número de la última venta
    const lastNumber = lastSale.getDataValue('number').split('-')[1];
    const nextNumber = parseInt(lastNumber, 10) + 1;
    return `V-${nextNumber.toString().padStart(5, '0')}`;
  }
}
