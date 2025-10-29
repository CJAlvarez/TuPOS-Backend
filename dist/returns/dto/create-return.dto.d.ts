export declare class CreateReturnDto {
    id_sale: number;
    id_client: number;
    id_terminal: number;
    id_invoice?: number;
    date: string;
    total: number;
    reason?: string;
    status: string;
    id_store?: number;
    return_items: number[];
    _return_items: any[];
}
