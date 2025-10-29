import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { GetPaymentsQueryDto } from './dto/get-payments-query.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { Payment } from '../entities/payment.entity';
import { PaymentService } from './payment.service';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    findAll(req: any, query: GetPaymentsQueryDto): Promise<any>;
    findOne(id: string): Promise<Payment | null>;
    create(req: any, data: CreatePaymentDto): Promise<Payment>;
    update(dto: UpdatePaymentDto): Promise<[number, Payment[]]>;
    remove(req: any, id: string): Promise<number>;
    updateStatus(req: any, dto: UpdatePaymentStatusDto): Promise<[number, Payment[]]>;
}
