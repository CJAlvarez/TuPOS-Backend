export declare const VERSION_PATTERN: RegExp;
export declare const UNKNOWN_VERSION = "0.0.0";
export declare function readOwnVersion(): string;
export declare function parseVersion(value: unknown): number[] | null;
export declare function compareVersions(a: unknown, b: unknown): -1 | 0 | 1 | null;
export declare function isBehind(client: unknown, required: unknown): boolean;
