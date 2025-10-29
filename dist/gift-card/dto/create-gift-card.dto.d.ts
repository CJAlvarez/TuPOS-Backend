export declare class CreateGiftCardDto {
    code: string;
    initial_balance: number;
    current_balance: number;
    id_client?: number;
    created_by: number;
    id_store?: number;
    issued_at?: Date;
    expires_at?: Date;
}
