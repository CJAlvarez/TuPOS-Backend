import { Model } from 'sequelize-typescript';
export declare class Cashbox extends Model<Cashbox> {
    id: number;
    id_store: number;
    opening_amount: number;
    closing_amount: number;
    opened_at: Date;
    opened_by: number;
    closed_at: Date;
    closed_by: number;
    created_at: Date;
    created_by: number;
    updated_at: Date;
    disabled_at?: Date | null;
    disabled_by?: number | null;
    deleted_at?: Date | null;
    deleted_by?: number | null;
}
export interface CashboxCreationAttributes {
    opening_amount: number;
    closing_amount?: number;
    created_by: number;
    opened_at: Date;
    closed_at?: Date;
}
