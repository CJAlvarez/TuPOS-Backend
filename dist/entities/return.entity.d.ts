import { Model } from 'sequelize-typescript';
import { ReturnItem } from './return-item.entity';
export declare class Return extends Model<Return> {
    return_items: ReturnItem[];
    id: number;
    id_store: number;
    id_sale: number;
    id_client?: number;
    id_terminal?: number;
    id_invoice?: number;
    date: Date;
    total: number;
    reason: string;
    created_by: number;
    created_at: Date;
    disabled_at?: Date | null;
    disabled_by?: number | null;
    deleted_at?: Date | null;
    deleted_by?: number | null;
}
export interface ReturnCreationAttributes {
    id_sale: number;
    id_client: number;
    id_terminal: number;
    id_invoice: number;
    date: Date;
    total: number;
    reason?: string;
    created_by: number;
    created_at?: Date;
}
