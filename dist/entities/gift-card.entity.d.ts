import { Model } from 'sequelize-typescript';
export declare class GiftCard extends Model<GiftCard> {
    id: number;
    id_store: number;
    code: string;
    initial_balance: number;
    current_balance: number;
    id_client: number;
    created_by: number;
    issued_at: Date;
    expires_at: Date;
    disabled_at?: Date | null;
    disabled_by?: number | null;
    deleted_at?: Date | null;
    deleted_by?: number | null;
}
export interface GiftCardCreationAttributes {
    code: string;
    initial_balance: number;
    current_balance: number;
    id_client?: number;
    active?: boolean;
    issued_at?: Date;
    expires_at?: Date;
}
