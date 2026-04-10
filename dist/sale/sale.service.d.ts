import { Sale } from '../entities/sale.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { GetSalesQueryDto } from './dto/get-sales-query.dto';
import { UpdateSaleStatusDto } from './dto/update-sale-status.dto';
import { UtilsService } from 'src/utils/utils.service';
import { Sequelize } from 'sequelize-typescript';
import { RoyaltyService } from 'src/royalty/royalty.service';
import { GiftCardService } from 'src/gift-card/gift-card.service';
import { InventoryService } from 'src/inventory/inventory.service';
import { PaymentService } from 'src/payment/payment.service';
import { SaleItemService } from 'src/sale-item/sale-item.service';
export declare class SaleService {
    private readonly saleModel;
    private readonly utilsService;
    private readonly royaltyService;
    private readonly giftCardService;
    private readonly inventoryService;
    private readonly paymentService;
    private readonly saleItemService;
    private readonly sequelize;
    constructor(saleModel: typeof Sale, utilsService: UtilsService, royaltyService: RoyaltyService, giftCardService: GiftCardService, inventoryService: InventoryService, paymentService: PaymentService, saleItemService: SaleItemService, sequelize: Sequelize);
    findAll(query: GetSalesQueryDto, id_store?: number): Promise<{
        count: number;
        list: Sale[];
        skip: number;
    }>;
    findOne(id: number): Promise<Sale | null>;
    create(internal_user_id: number, internal_store_id: number, dto: CreateSaleDto): Promise<Sale>;
    update(dto: UpdateSaleDto): Promise<[number, Sale[]]>;
    remove(internal_user_id: number, id: number): Promise<any>;
    updateStatus(internal_user_id: number, dto: UpdateSaleStatusDto): Promise<[number, Sale[]]>;
    createSale(dto: any, saleNumber: any, userId: any, transaction: any): Promise<Sale>;
    processItems(sale: any, items: any, storeId: any, transaction: any): Promise<void>;
    generateNumber(): Promise<string>;
}
