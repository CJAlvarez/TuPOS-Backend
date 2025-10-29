import { Model } from 'sequelize-typescript';
export declare class Terminal extends Model<Terminal> {
    id: number;
    id_store: number;
    code: string;
    name: string;
    id_address: number;
    device: string;
    last_sync: Date;
    created_by: number;
    created_at: Date;
    updated_at: Date;
    disabled_at?: Date | null;
    disabled_by?: number | null;
    deleted_at?: Date | null;
    deleted_by?: number | null;
}
export interface TerminalCreationAttributes {
    id_store: number;
    code: string;
    name: string;
    id_address: number;
    device: string;
    last_sync?: Date;
}
