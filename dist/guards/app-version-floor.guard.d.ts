import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
export declare class AppVersionFloorGuard implements CanActivate {
    private readonly reflector;
    private readonly logger;
    private readonly ownVersion;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}
