export declare class UtilsService {
    months: {
        n: string;
        value: string;
        label: string;
    }[];
    generateToken(size: number, level?: number): string;
    encrypt(text: string, key: Buffer, iv: Buffer): string;
    decrypt(text: string, key: Buffer, iv: Buffer): string;
    createCsv({ data, filename, headers, }: {
        data: any[];
        filename: string;
        headers?: any[];
    }): Promise<string>;
    readHtmlFile(filePath: string): Promise<string>;
    cleanFilesDirectory(): Promise<void>;
    paginate(limit: number, skip: number, count: number, last: boolean): {
        limit: number;
        skip: number;
        offset: number;
    };
    fixNumber(num: number, min?: number, max?: number): string;
}
