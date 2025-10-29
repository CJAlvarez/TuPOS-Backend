import { Model } from 'sequelize-typescript';
import { User } from './user.entity';
import { Client } from './client.entity';
import { Admin } from './admin.entity';
export interface ProfileCreationAttributes {
    id_user: number;
    firstname: string;
    lastname: string;
    id_gender: number;
    id_country: number;
    phone: string;
    identification: string;
    address?: string;
    image?: string;
    created_at?: Date;
    updated_at?: Date;
}
export declare class Profile extends Model<Profile, ProfileCreationAttributes> {
    id_profile: number;
    id_user: number;
    user?: User;
    client?: Client;
    admin?: Admin;
    firstname: string;
    lastname: string;
    id_gender: number;
    id_country: number;
    phone: string;
    address: string;
    identification: string;
    image: string;
    created_at: Date;
    updated_at: Date;
}
