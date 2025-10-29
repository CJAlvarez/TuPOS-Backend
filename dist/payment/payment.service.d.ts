import { Payment } from '../entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { GetPaymentsQueryDto } from './dto/get-payments-query.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { UtilsService } from 'src/utils/utils.service';
export declare class PaymentService {
    private readonly paymentModel;
    private readonly utilsService;
    constructor(paymentModel: typeof Payment, utilsService: UtilsService);
    findAll(query: GetPaymentsQueryDto, id_store?: number): Promise<{
        count: number;
        list: Payment[];
        skip: number;
    }>;
    findOne(id: number): Promise<Payment | null>;
    create(internal_user_id: number, internal_store_id: number, dto: CreatePaymentDto): Promise<Payment>;
    update(dto: UpdatePaymentDto): Promise<[number, Payment[]]>;
    remove(internal_user_id: number, id: number): Promise<number>;
    updateStatus(internal_user_id: number, dto: UpdatePaymentStatusDto): Promise<[number, Payment[]]>;
}
