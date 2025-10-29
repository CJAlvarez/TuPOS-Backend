export declare class CreateDiscountRuleDto {
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
    id_store?: number;
    created_at?: Date;
}
