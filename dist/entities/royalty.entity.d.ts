import { Model } from 'sequelize-typescript';
export declare class Royalty extends Model<Royalty> {
    id: number;
    id_store: number;
    id_client: number;
    id_sale: number;
    id_status: number;
    points: number;
    created_by: number;
    created_at: Date;
    expire_at: Date;
    disabled_at?: Date | null;
    disabled_by?: number | null;
    deleted_at?: Date | null;
    deleted_by?: number | null;
}
export interface RoyaltyCreationAttributes {
    id_client: number;
    id_sale: number;
    id_status: number;
    points: number;
    created_by: number;
    created_at?: Date;
    expire_at: Date;
}
