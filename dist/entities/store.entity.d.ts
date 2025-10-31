import { Model } from 'sequelize-typescript';
export declare class Store extends Model<Store> {
    id: number;
    code: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    id_loyalty_type: number;
    loyalty_value: number;
    tax_included: number;
    theme_config: any;
    created_by: number;
    created_at: Date;
    updated_at: Date;
    disabled_at?: Date | null;
    disabled_by?: number | null;
    deleted_at?: Date | null;
    deleted_by?: number | null;
}
export interface StoreCreationAttributes {
    code: string;
    name: string;
    address: string;
    phone: string;
    email: string;
}
