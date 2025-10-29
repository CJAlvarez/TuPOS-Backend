import { Model } from 'sequelize-typescript';
export declare class DiscountRule extends Model<DiscountRule> {
    id: number;
    id_store: number;
    name: string;
    description: string;
    id_type: number;
    value: number;
    start_date: Date;
    end_date: Date;
    min_quantity: number;
    id_product: number;
    id_category: number;
    id_client: number;
    id_campaign: number;
    created_by: number;
    created_at: Date;
    disabled_at?: Date | null;
    disabled_by?: number | null;
    deleted_at?: Date | null;
    deleted_by?: number | null;
}
export interface DiscountRuleCreationAttributes {
    name: string;
    description?: string;
    id_type: number;
    value: number;
    start_date: Date;
    end_date: Date;
    min_quantity?: number;
    id_product?: number;
    id_category?: number;
    id_client?: number;
    id_campaign?: number;
    created_by: number;
    created_at?: Date;
}
