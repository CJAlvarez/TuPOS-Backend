import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { Profile } from '../entities/profile.entity';
import { Admin } from '../entities/admin.entity';
import { Store } from '../entities/store.entity';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { FirstLoginDto } from './dto/first-login.dto';
import { JobsService } from 'src/jobs/jobs.service';
export declare class AuthService {
    private readonly jwtService;
    private readonly userModel;
    private readonly profileModel;
    private readonly adminModel;
    private readonly storeModel;
    private readonly jobsService;
    constructor(jwtService: JwtService, userModel: typeof User, profileModel: typeof Profile, adminModel: typeof Admin, storeModel: typeof Store, jobsService: JobsService);
    getUserData(id_user: number): Promise<any>;
    validateUser(username: string, password: string): Promise<any>;
    login(loginDto: LoginDto): Promise<any>;
    changePassword(internal_user_id: any, dto: ChangePasswordDto): Promise<any>;
    recoverPassword(dto: RecoverPasswordDto): Promise<any>;
    resetPassword(dto: ResetPasswordDto): Promise<any>;
    firstLogin(internal_user_id: any, dto: FirstLoginDto): Promise<any>;
}
