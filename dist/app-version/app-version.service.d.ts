export interface AppVersionInfo {
    version: string;
    min_version: string;
    mandatory_update: boolean;
}
export declare class AppVersionService {
    private readonly logger;
    private readonly version;
    getVersionInfo(): AppVersionInfo;
}
