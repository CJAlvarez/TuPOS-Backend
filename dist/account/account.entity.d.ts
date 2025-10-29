import { Model } from 'sequelize-typescript';
export declare class Account extends Model<Account> {
    id: number;
    username: string;
    email: string;
}
