import { Model } from 'sequelize-typescript';
export declare class Invoice extends Model<Invoice> {
    id: number;
    id_store: number;
    id_user: number;
    number: string;
    title?: string;
    client: string;
    store_name?: string;
    address?: string;
    town?: string;
    department?: string;
    date?: Date;
    items?: string;
    total: number;
    phone?: string;
    ref?: string;
    file?: string;
    created_by?: number;
    created_at?: Date;
}
