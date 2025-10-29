import { Model } from 'sequelize-typescript';
import { Return } from './return.entity';
export declare class ReturnItem extends Model<ReturnItem> {
    id: number;
    id_store: number;
    id_return: number;
    return: Return;
    id_product: number;
    id_sale_item: number;
    disabled_at?: Date | null;
    disabled_by?: number | null;
    deleted_at?: Date | null;
    deleted_by?: number | null;
}
export interface ReturnItemCreationAttributes {
    id_return: number;
    id_product: number;
    id_sale_item: number;
}
