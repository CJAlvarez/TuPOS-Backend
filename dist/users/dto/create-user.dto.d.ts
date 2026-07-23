import { UserAdminDto } from './user-admin.dto';
import { ProfileAdminDto } from './profile-admin.dto';
export declare class CreateUserDto {
    user: UserAdminDto;
    profile: ProfileAdminDto;
    id_admin_type?: number;
}
