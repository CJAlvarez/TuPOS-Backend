import { InvoiceConfigService } from './invoice-config.service';
import { CreateInvoiceConfigDto } from './dto/create-invoice-config.dto';
import { UpdateInvoiceConfigDto } from './dto/update-invoice-config.dto';
import { InvoiceConfig } from '../entities/invoice-config.entity';
export declare class InvoiceConfigController {
    private readonly service;
    constructor(service: InvoiceConfigService);
    findAll(req: any): Promise<InvoiceConfig | null>;
    findOne(id: number): Promise<InvoiceConfig>;
    create(req: any, dto: CreateInvoiceConfigDto): Promise<InvoiceConfig>;
    update(dto: UpdateInvoiceConfigDto): Promise<{
        title: string;
        message: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
