import { Model } from 'sequelize-typescript';
import { Profile } from './profile.entity';
import { Client } from './client.entity';
import { Admin } from './admin.entity';
export interface UserCreationAttributes {
    username: string;
    password: string;
    email: string;
    createdAt?: Date;
}
export declare class User extends Model<User> {
    profile?: Profile;
    client?: Client;
    admin?: Admin;
    id: number;
    username: string;
    password: string;
    email: string;
    restoreCode: string | null;
    firstLogin: boolean | null;
    steps2: boolean | null;
    createdBy: number | null;
    createdAt: Date | null;
    disabledAt: Date | null;
    disabledBy: number | null;
}
