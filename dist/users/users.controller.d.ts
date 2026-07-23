import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EnableUserDto } from './dto/enable-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
export declare class UsersController {
    private readonly service;
    constructor(service: UsersService);
    findAll(req: any, query: GetUsersQueryDto): Promise<{
        count: number;
        list: any[];
        skip: number;
    }>;
    create(req: any, dto: CreateUserDto): Promise<any>;
    update(req: any, dto: UpdateUserDto): Promise<any>;
    remove(req: any, dto: DeleteUserDto): Promise<{
        message: string;
    }>;
    setUserStatus(req: any, body: UpdateUserStatusDto): Promise<any>;
    setEnableUser(req: any, body: EnableUserDto): Promise<{
        message: string;
    }>;
    recoverPassword(body: {
        id_user: number;
        password: string;
        secret?: boolean;
    }): Promise<any>;
    getUserAccesses(id_user: number): Promise<any>;
}
