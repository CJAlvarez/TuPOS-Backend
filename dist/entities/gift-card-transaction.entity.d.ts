import { Model } from 'sequelize-typescript';
export declare class GiftCardTransaction extends Model<GiftCardTransaction> {
    id: number;
    id_store: number;
    id_gift_card: number;
    id_sale: number;
    id_type?: number;
    amount: number;
    created_by: number;
    created_at: Date;
    disabled_at?: Date | null;
    disabled_by?: number | null;
    deleted_at?: Date | null;
    deleted_by?: number | null;
}
export interface GiftCardTransactionCreationAttributes {
    id_gift_card: number;
    id_sale?: number;
    id_type: number;
    amount: number;
    created_at?: Date;
}
