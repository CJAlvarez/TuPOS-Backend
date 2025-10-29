import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { FirstLoginDto } from './dto/first-login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<any>;
    getProfile(req: any): any;
    getUserData(req: any): Promise<any>;
    changePassword(req: any, dto: ChangePasswordDto): Promise<any>;
    recoverPassword(dto: RecoverPasswordDto): Promise<any>;
    resetPassword(dto: ResetPasswordDto): Promise<any>;
    firstLogin(req: any, dto: FirstLoginDto): Promise<any>;
}
