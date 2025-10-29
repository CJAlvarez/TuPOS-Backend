export declare class SaleItemDto {
    id_product: number;
    quantity: number;
    price: number;
    discount: number;
    tax: number;
    total: number;
    sale_type?: 'unit' | 'box';
}
export declare class AppliedGiftCardDto {
    id_gift_card: number;
    amount_used: number;
}
export declare class PaymentDto {
    id_payment_method: number;
    amount: number;
    reference?: string;
    notes?: string;
}
export declare class CreateSaleDto {
    id_client?: number | null;
    subtotal: number;
    discount_total: number;
    tax_total: number;
    total: number;
    date: Date;
    items: SaleItemDto[];
    gift_cards?: AppliedGiftCardDto[];
    payment: PaymentDto;
    id_payment_method?: number;
    id_status?: number;
    notes?: string;
    tax_included?: boolean;
    created_by?: number;
    id_store?: number;
}
