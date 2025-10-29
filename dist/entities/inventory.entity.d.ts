import { Model } from 'sequelize-typescript';
import { Product } from './product.entity';
export declare class Inventory extends Model<Inventory> {
    id: number;
    id_store: number;
    id_product: number;
    product: Product;
    code: string;
    box_quantity: number;
    unit_quantity: number;
    expiration_date: Date;
    created_by: number;
    created_at: Date;
    updated_at: Date;
}
export interface InventoryCreationAttributes {
    id_product: number;
    code: string;
    box_quantity: number;
    unit_quantity: number;
    expiration_date?: Date;
    created_by: number;
}
