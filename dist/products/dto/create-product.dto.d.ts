export declare class CreateProductDto {
    name: string;
    code: string;
    description?: string;
    content?: string;
    category?: string;
    box_price: number;
    unit_price: number;
    unit_discount_percent?: number;
    unit_discount?: number;
    id_unit_discount_type?: number;
    box_discount_percent?: number;
    box_discount?: number;
    id_box_discount_type?: number;
    tax_percent?: number;
    min_stock?: number;
    box_amount: number;
    loyalty_eligible: number;
    created_by?: number;
    id_store?: number;
    id_type: number;
}
