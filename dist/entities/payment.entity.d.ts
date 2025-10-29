import { Model } from 'sequelize-typescript';
export declare class Payment extends Model<Payment> {
    id: number;
    id_store: number;
    id_sale: number;
    id_payment_method: number;
    amount: number;
    reference: string;
    date: Date;
    created_by: number;
    created_at: Date;
    updated_at: Date;
    disabled_at?: Date | null;
    disabled_by?: number | null;
    deleted_at?: Date | null;
    deleted_by?: number | null;
}
export interface PaymentCreationAttributes {
    id_sale: number;
    id_payment_method: number;
    amount: number;
    reference?: string;
    date: Date;
}
