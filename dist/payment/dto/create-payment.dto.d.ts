export declare class CreatePaymentDto {
    id_sale: number;
    id_payment_method: number;
    amount: number;
    reference?: string;
    date: Date;
    created_by: number;
    id_store?: number;
}
