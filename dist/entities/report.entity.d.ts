import { Model } from 'sequelize-typescript';
export declare class Report extends Model<Report> {
    id: number;
    id_store: number;
    name: string;
    code: string;
    type: string;
    frequency_pattern: string;
    last_execution: Date;
    parameters: any;
    last_results: any;
    is_active: boolean;
    createdAt: Date;
    updatedAt: Date;
}
