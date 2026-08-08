import { User } from '../entities/user.entity';
import { Profile } from '../entities/profile.entity';
import { Admin } from '../entities/admin.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EnableUserDto } from './dto/enable-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { Sequelize } from 'sequelize-typescript';
import { UtilsService } from 'src/utils/utils.service';
import { JobsService } from 'src/jobs/jobs.service';
export declare class UsersService {
    private readonly userModel;
    private readonly profileModel;
    private readonly adminModel;
    private readonly jobsService;
    private readonly utilsService;
    private readonly sequelize;
    constructor(userModel: typeof User, profileModel: typeof Profile, adminModel: typeof Admin, jobsService: JobsService, utilsService: UtilsService, sequelize: Sequelize);
    findAll(query: GetUsersQueryDto): Promise<{
        count: number;
        list: any[];
        skip: number;
    }>;
    private buildOrder;
    create(internal_user_id: any, dto: CreateUserDto): Promise<any>;
    update(internal_user_id: number, dto: UpdateUserDto): Promise<any>;
    remove(internal_user_id: any, dto: DeleteUserDto): Promise<{
        message: string;
    }>;
    setEnableUser(internal_user_id: any, dto: EnableUserDto): Promise<{
        message: string;
    }>;
    setUserStatus(internal_user_id: number, body: UpdateUserStatusDto): Promise<any>;
    recoverUserPassword(id_user: number, options: {
        password?: string;
        secret?: boolean;
    }): Promise<any>;
    getUserAccesses(id_user: number): Promise<any>;
}
