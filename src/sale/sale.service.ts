import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sale } from '../entities/sale.entity';
import { SaleItem } from '../entities/sale-item.entity';
import { Product } from '../entities/product.entity';
import { Inventory } from '../entities/inventory.entity';
import { Payment } from '../entities/payment.entity';
import { GiftCard } from '../entities/gift-card.entity';
import { GiftCardTransaction } from '../entities/gift-card-transaction.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { GetSalesQueryDto } from './dto/get-sales-query.dto';
import { UpdateSaleStatusDto } from './dto/update-sale-status.dto';
import { Op } from 'sequelize';
import { UtilsService } from 'src/utils/utils.service';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class SaleService {
  constructor(
    @InjectModel(Sale)
    private readonly saleModel: typeof Sale,
    @InjectModel(SaleItem)
    private readonly saleItemModel: typeof SaleItem,
    @InjectModel(Product)
    private readonly productModel: typeof Product,
    @InjectModel(Inventory)
    private readonly inventoryModel: typeof Inventory,
    @InjectModel(Payment)
    private readonly paymentModel: typeof Payment,
    @InjectModel(GiftCard)
    private readonly giftCardModel: typeof GiftCard,
    @InjectModel(GiftCardTransaction)
    private readonly giftCardTransactionModel: typeof GiftCardTransaction,
    private readonly utilsService: UtilsService,
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(query: GetSalesQueryDto, id_store?: number) {
    const { search_word, limit = 10, skip = 0 } = query;
    const where: any = {};

    if (id_store) {
      where.id_store = id_store;
    }

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
      // Agregar el store_id al DTO
      dto.id_store = internal_store_id;

      // Generar número de venta
      const saleNumber = await this.generateSaleNumber();

      // Crear la venta
      const sale = await this.saleModel.create(
        {
          id_client: dto.id_client || null,
          id_payment_method: dto.id_payment_method || 1, // Valor por defecto
          id_status: dto.id_status || 1, // Estado: completada
          id_store: dto.id_store,
          number: saleNumber,
          subtotal: dto.subtotal,
          discount_total: dto.discount_total,
          tax_total: dto.tax_total,
          total: dto.total,
          date: dto.date || new Date(),
          notes: dto.notes || null,
          created_by: internal_user_id,
        } as any,
        { transaction },
      );

      // Crear los items de la venta
      if (dto.items && dto.items.length > 0) {
        for (const item of dto.items) {
          // Crear el item de venta
          await this.saleItemModel.create(
            {
              id_sale: sale.getDataValue('id'),
              id_store: dto.id_store,
              id_product: item.id_product,
              quantity: item.quantity,
              price: item.price,
              discount: item.discount,
              tax: item.tax,
              total: item.total,
            } as any,
            { transaction },
          );

          // Actualizar inventario del producto
          const product = await this.productModel.findByPk(item.id_product, {
            transaction,
          });

          if (!product) {
            throw new BadRequestException(
              `Producto con ID ${item.id_product} no encontrado`,
            );
          }

          // Calcular unidades a descontar según el tipo de venta
          let unitsToDeduct = item.quantity;
          const boxAmount = product.getDataValue('box_amount');
          if (item.sale_type === 'box' && boxAmount) {
            unitsToDeduct = item.quantity * boxAmount;
          }

          console.log(
            `Producto: ${product.getDataValue('name')}, Tipo: ${item.sale_type}, Cantidad en venta: ${item.quantity}, Unidades a descontar: ${unitsToDeduct}`,
          );

          // Obtener inventarios disponibles del producto
          const inventories = await this.inventoryModel.findAll({
            where: {
              id_product: item.id_product,
              unit_quantity: {
                [Op.gt]: 0, // Solo inventarios con stock disponible
              },
            },
            order: [
              // En MySQL, usar ISNULL para poner NULL al final
              [this.sequelize.literal('ISNULL(expiration_date)'), 'ASC'],
              ['expiration_date', 'ASC'],
            ],
            transaction,
          });

          // Calcular stock disponible total
          let availableStock = inventories.reduce(
            (sum, inv) => sum + inv.getDataValue('unit_quantity'),
            0,
          );

          if (unitsToDeduct > availableStock) {
            throw new BadRequestException(
              `Stock insuficiente para el producto ${product.getDataValue('name')}. Disponible: ${availableStock}, Requerido: ${unitsToDeduct}`,
            );
          }

          // Descontar del inventario (FIFO - primero en expirar, primero en salir)
          let remainingToDeduct = unitsToDeduct;
          for (const inventory of inventories) {
            if (remainingToDeduct <= 0) break;

            const currentQuantity = inventory.getDataValue('unit_quantity');
            const quantityToTake = Math.min(currentQuantity, remainingToDeduct);

            console.log(
              `Inventario ID: ${inventory.getDataValue('id')}, Stock actual: ${currentQuantity}, Descontando: ${quantityToTake}, Quedará: ${currentQuantity - quantityToTake}`,
            );

            await inventory.update(
              {
                unit_quantity: currentQuantity - quantityToTake,
              },
              { transaction },
            );

            remainingToDeduct -= quantityToTake;
          }
        }
      }

      // Procesar tarjetas de regalo si hay
      if (dto.gift_cards && dto.gift_cards.length > 0) {
        for (const giftCardData of dto.gift_cards) {
          const giftCard = await this.giftCardModel.findByPk(
            giftCardData.id_gift_card,
            { transaction },
          );

          if (!giftCard) {
            throw new BadRequestException(
              `Tarjeta de regalo con ID ${giftCardData.id_gift_card} no encontrada`,
            );
          }

          // Validar saldo
          const currentBalanceRaw = giftCard.getDataValue('current_balance');
          const currentBalance =
            typeof currentBalanceRaw === 'string'
              ? parseFloat(currentBalanceRaw)
              : currentBalanceRaw;

          if (currentBalance < giftCardData.amount_used) {
            throw new BadRequestException(
              `Saldo insuficiente en la tarjeta de regalo ${giftCard.getDataValue('code')}`,
            );
          }

          // Actualizar saldo de la tarjeta
          const newBalance = currentBalance - giftCardData.amount_used;
          await giftCard.update(
            {
              current_balance: newBalance,
            },
            { transaction },
          );

          // Crear transacción de tarjeta de regalo
          await this.giftCardTransactionModel.create(
            {
              id_gift_card: giftCard.getDataValue('id'),
              id_sale: sale.getDataValue('id'),
              id_store: dto.id_store,
              amount: -giftCardData.amount_used, // Negativo porque se está usando
              balance_after: newBalance,
              transaction_type: 'use',
              notes: `Aplicada a venta #${saleNumber}`,
              created_by: internal_user_id,
            } as any,
            { transaction },
          );
        }
      }

      // Crear registro de pago
      await this.paymentModel.create(
        {
          id_sale: sale.getDataValue('id'),
          id_store: dto.id_store,
          id_payment_method: dto.payment.id_payment_method,
          amount: dto.payment.amount,
          reference: dto.payment.reference || null,
          date: dto.date || new Date(),
          created_by: internal_user_id,
        } as any,
        { transaction },
      );

      await transaction.commit();
      return sale;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  private async generateSaleNumber(): Promise<string> {
    const lastSale = await this.saleModel.findOne({
      order: [['id', 'DESC']],
    });

    if (!lastSale || !lastSale.number) {
      return 'V-00001';
    }

    // Extraer el número de la última venta
    const lastNumber = lastSale.number.split('-')[1];
    const nextNumber = parseInt(lastNumber, 10) + 1;
    return `V-${nextNumber.toString().padStart(5, '0')}`;
  }

  async update(dto: UpdateSaleDto): Promise<[number, Sale[]]> {
    return this.saleModel.update(dto as any, {
      where: { id: dto.id },
      returning: true,
    });
  }

  async remove(internal_user_id: number, id: number): Promise<number> {
    const [affectedRows] = await this.saleModel.update(
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
}
