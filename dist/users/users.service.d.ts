import { User } from '../entities/user.entity';
import { Client } from '../entities/client.entity';
import { Profile } from '../entities/profile.entity';
import { Admin } from '../entities/admin.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EnableUserDto } from './dto/enable-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { UtilsService } from 'src/utils/utils.service';
import { JobsService } from 'src/jobs/jobs.service';
export declare class UsersService {
    private readonly userModel;
    private readonly clientModel;
    private readonly profileModel;
    private readonly adminModel;
    private readonly jobsService;
    private readonly utilsService;
    constructor(userModel: typeof User, clientModel: typeof Client, profileModel: typeof Profile, adminModel: typeof Admin, jobsService: JobsService, utilsService: UtilsService);
    findAll(query: any): Promise<{
        count: number;
        list: User[];
        skip: number;
    }>;
    create(internal_user_id: any, dto: CreateUserDto): Promise<User>;
    update(internal_user_id: number, dto: UpdateUserDto): Promise<any>;
    remove(internal_user_id: any, dto: DeleteUserDto): Promise<{
        message: string;
    }>;
    setEnableUser(internal_user_id: any, dto: EnableUserDto): Promise<{
        message: string;
    }>;
    setUserAdmin(id_user: number): Promise<{
        message: string;
    }>;
    setUserClient(id_user: number): Promise<{
        message: string;
    }>;
    recoverUserPassword(id_user: number, options: {
        password?: string;
        secret?: boolean;
    }): Promise<any>;
    getUserAccesses(id_user: number): Promise<any>;
}
