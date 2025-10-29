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
import { UtilsService } from 'src/utils/utils.service';
import { Sequelize } from 'sequelize-typescript';
export declare class SaleService {
    private readonly saleModel;
    private readonly saleItemModel;
    private readonly productModel;
    private readonly inventoryModel;
    private readonly paymentModel;
    private readonly giftCardModel;
    private readonly giftCardTransactionModel;
    private readonly utilsService;
    private readonly sequelize;
    constructor(saleModel: typeof Sale, saleItemModel: typeof SaleItem, productModel: typeof Product, inventoryModel: typeof Inventory, paymentModel: typeof Payment, giftCardModel: typeof GiftCard, giftCardTransactionModel: typeof GiftCardTransaction, utilsService: UtilsService, sequelize: Sequelize);
    findAll(query: GetSalesQueryDto, id_store?: number): Promise<{
        count: number;
        list: Sale[];
        skip: number;
    }>;
    findOne(id: number): Promise<Sale | null>;
    create(internal_user_id: number, internal_store_id: number, dto: CreateSaleDto): Promise<Sale>;
    private generateSaleNumber;
    update(dto: UpdateSaleDto): Promise<[number, Sale[]]>;
    remove(internal_user_id: number, id: number): Promise<number>;
    updateStatus(internal_user_id: number, dto: UpdateSaleStatusDto): Promise<[number, Sale[]]>;
}
