import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class AppKeyGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
