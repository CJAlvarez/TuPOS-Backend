import { AppVersionInfo, AppVersionService } from './app-version.service';
export declare class AppVersionController {
    private readonly service;
    constructor(service: AppVersionService);
    getVersionInfo(): AppVersionInfo;
}
