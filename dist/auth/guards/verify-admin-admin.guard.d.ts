import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Admin } from '../../entities/admin.entity';
export declare class VerifyAdminAdminGuard implements CanActivate {
    private readonly adminModel;
    constructor(adminModel: typeof Admin);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
