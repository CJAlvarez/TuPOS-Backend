import { Model } from 'sequelize-typescript';
export declare class InvoiceConfig extends Model<InvoiceConfig> {
    id: number;
    id_store: number;
    config: any;
    printer_ip: string;
    printer_port: string;
}
