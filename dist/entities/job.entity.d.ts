import { Model } from 'sequelize-typescript';
export declare class Job extends Model {
    id: number;
    type: string;
    data: any;
    status: string;
    created_at: Date;
    updated_at: Date;
    completed_at?: Date;
    deleted_at?: Date;
}
