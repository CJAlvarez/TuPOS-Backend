import { Invoice } from '../entities/invoice.entity';
import { InvoiceConfig } from '../entities/invoice-config.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { UtilsService } from 'src/utils/utils.service';
export declare class InvoicesService {
    private readonly invoiceModel;
    private readonly invoiceConfigModel;
    private readonly utilsService;
    private readonly logger;
    constructor(invoiceModel: typeof Invoice, invoiceConfigModel: typeof InvoiceConfig, utilsService: UtilsService);
    findAll(query: any, id_store?: number): Promise<{
        count: number;
        list: Invoice[];
        skip: number;
    }>;
    findOne(id: number): Promise<Invoice>;
    create(internal_user_id: any, internal_store_id: number, dto: CreateInvoiceDto): Promise<any>;
    update(id: number, dto: UpdateInvoiceDto): Promise<Invoice>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
