import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EnableUserDto } from './dto/enable-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { User } from '../entities/user.entity';
export declare class UsersController {
    private readonly service;
    constructor(service: UsersService);
    findAll(req: any, query: any): Promise<{
        count: number;
        list: User[];
        skip: number;
    }>;
    create(req: any, dto: CreateUserDto): Promise<User>;
    update(req: any, dto: UpdateUserDto): Promise<any>;
    remove(req: any, dto: DeleteUserDto): Promise<{
        message: string;
    }>;
    setEnableUser(req: any, body: EnableUserDto): Promise<{
        message: string;
    }>;
    setUserAdmin(body: {
        id_user: number;
    }): Promise<{
        message: string;
    }>;
    setUserClient(body: {
        id_user: number;
    }): Promise<{
        message: string;
    }>;
    recoverPassword(body: {
        id_user: number;
        password: string;
        secret?: boolean;
    }): Promise<any>;
    getUserAccesses(id_user: number): Promise<any>;
}
