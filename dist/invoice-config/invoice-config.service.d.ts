import { InvoiceConfig } from '../entities/invoice-config.entity';
import { CreateInvoiceConfigDto } from './dto/create-invoice-config.dto';
import { UpdateInvoiceConfigDto } from './dto/update-invoice-config.dto';
export declare class InvoiceConfigService {
    private readonly invoiceConfigModel;
    constructor(invoiceConfigModel: typeof InvoiceConfig);
    findAll(id_store?: number): Promise<InvoiceConfig | null>;
    findOne(id: number): Promise<InvoiceConfig>;
    create(internal_store_id: number, dto: CreateInvoiceConfigDto): Promise<InvoiceConfig>;
    update(dto: UpdateInvoiceConfigDto): Promise<{
        title: string;
        message: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
