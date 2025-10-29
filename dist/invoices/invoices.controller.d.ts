import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice } from '../entities/invoice.entity';
export declare class InvoicesController {
    private readonly service;
    constructor(service: InvoicesService);
    findAll(req: any, query: any): Promise<{
        count: number;
        list: Invoice[];
        skip: number;
    }>;
    findOne(id: number): Promise<Invoice>;
    create(req: any, dto: CreateInvoiceDto): Promise<any>;
    update(id: number, dto: UpdateInvoiceDto): Promise<Invoice>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
