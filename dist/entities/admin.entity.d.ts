import { Model } from 'sequelize-typescript';
import { User } from './user.entity';
import { Profile } from './profile.entity';
export interface AdminCreationAttributes {
    id_user: number;
    id_admin_type: number;
}
export declare class Admin extends Model<Admin, AdminCreationAttributes> {
    profile?: Profile;
    user?: User;
    id_user: number;
    id_store: number;
    id_admin_type: number;
    disabled_at: Date;
    disabled_by: number;
    deleted_at: Date;
    deleted_by: number;
}
