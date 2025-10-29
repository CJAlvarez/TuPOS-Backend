export declare class CreateInventoryDto {
    id_product: number;
    code: string;
    box_quantity: number;
    unit_quantity: number;
    expiration_date?: Date;
    created_by?: number;
    id_store?: number;
}
