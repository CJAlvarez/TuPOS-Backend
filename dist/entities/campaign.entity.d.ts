import { Model } from 'sequelize-typescript';
export declare class Campaign extends Model<Campaign> {
    id: number;
    id_type: number;
    id_store: number;
    name: string;
    description: string;
    start_date: Date;
    end_date: Date;
    active: boolean;
    created_by: number;
    created_at: Date;
    disabled_at?: Date | null;
    disabled_by?: number | null;
    deleted_at?: Date | null;
    deleted_by?: number | null;
}
export interface CampaignCreationAttributes {
    id_type: number;
    name: string;
    description?: string;
    start_date: Date;
    end_date: Date;
    active?: boolean;
    created_at?: Date;
}
