import { Model } from 'sequelize-typescript';
export declare class Notification extends Model<Notification> {
    id: number;
    id_store: number;
    id_status: number;
    id_type: number;
    subject: string;
    content: string;
    created_at: Date;
    created_by: number;
    seen_at: Date;
    seen_by: number;
    archived_at: Date;
    archived_by: number;
    deleted_at: Date;
    deleted_by: number;
}
export interface NotificationCreationAttributes {
    id_status: number;
    id_type: number;
    subject: string;
    content: string;
    created_at?: Date;
    created_by: number;
    seen_at?: Date;
    archived_at?: Date;
    deleted_at?: Date;
}
