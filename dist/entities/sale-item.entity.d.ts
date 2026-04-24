import { Model } from 'sequelize-typescript';
import { Product } from './product.entity';
import { Inventory } from './inventory.entity';
export declare class SaleItem extends Model<SaleItem> {
    id: number;
    id_store: number;
    id_sale: number;
    id_product: number;
    product: Product;
    id_inventory?: number;
    inventory?: Inventory;
    quantity: number;
    price: number;
    discount: number;
    tax: number;
    total: number;
    created_at: Date;
    updated_at: Date;
    disabled_at?: Date | null;
    disabled_by?: number | null;
    deleted_at?: Date | null;
    deleted_by?: number | null;
}
export interface SaleItemCreationAttributes {
    id_sale: number;
    id_product: number;
    id_inventory?: number;
    quantity: number;
    price: number;
    discount: number;
    tax: number;
    total: number;
}
