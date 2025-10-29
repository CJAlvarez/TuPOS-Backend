import { Model } from 'sequelize-typescript';
export declare class Sale extends Model<Sale> {
    id: number;
    id_store: number;
    id_client?: number;
    id_payment_method: number;
    id_status: number;
    id_invoice: number;
    number: string;
    subtotal: number;
    discount_total: number;
    tax_total: number;
    total: number;
    date: Date;
    notes: string;
    created_by: number;
    created_at: Date;
    updated_at: Date;
    disabled_at?: Date | null;
    disabled_by?: number | null;
    deleted_at?: Date | null;
    deleted_by?: number | null;
}
export interface SaleCreationAttributes {
    id_user: number;
    id_client: number;
    id_payment_method: number;
    total: number;
    date: Date;
    id_status: number;
    id_invoice?: number;
    number: string;
    subtotal: number;
    discount_total: number;
    tax_total: number;
    is_status: boolean;
    notes?: string;
}
