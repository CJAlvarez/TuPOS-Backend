import { Model } from 'sequelize-typescript';
import { User } from './user.entity';
import { Profile } from './profile.entity';
export interface ClientCreationAttributes {
    id_user: number;
}
export declare class Client extends Model<Client, ClientCreationAttributes> {
    profile?: Profile;
    user?: User;
    id_user: number;
    id_store: number;
    loyalty_eligible: number;
    disabled_at?: Date | null;
    disabled_by?: number | null;
    deleted_at?: Date;
    deleted_by?: number;
}
