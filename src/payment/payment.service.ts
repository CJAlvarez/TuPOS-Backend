import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Payment } from '../entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { GetPaymentsQueryDto } from './dto/get-payments-query.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { Op } from 'sequelize';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment)
    private readonly paymentModel: typeof Payment,
    private readonly utilsService: UtilsService,
  ) {}

  async findAll(query: GetPaymentsQueryDto, id_store?: number) {
    const { search_word, limit = 10, skip = 0, id_sale } = query;
    const where: any = {};
    if (id_store) where.id_store = id_store;
    if (id_sale) where.id_sale = id_sale;
    if (search_word) {
      where[Op.or] = [
        { $id$: { [Op.like]: `%${search_word}%` } },
        { $reference$: { [Op.like]: `%${search_word}%` } },
      ];
    }
    const total = await this.paymentModel.count({ where });
    const paginate = this.utilsService.paginate(limit, skip, total, false);
    const rows = await this.paymentModel.findAll({
      where,
      limit: paginate.limit,
      offset: paginate.offset,
    });
    return {
      count: total,
      list: rows.map((row) => row.toJSON()),
      skip: paginate.skip,
    };
  }

  async findOne(id: number): Promise<Payment | null> {
    return this.paymentModel.findOne({ where: { id } });
  }

  async create(
    internal_user_id: number,
    internal_store_id: number,
    dto: CreatePaymentDto,
  ): Promise<Payment> {
    dto.created_by = internal_user_id;
    dto.id_store = internal_store_id;
    return this.paymentModel.create(dto as any);
  }

  async update(
    dto: UpdatePaymentDto,
  ): Promise<[number, Payment[]]> {
    return this.paymentModel.update(dto, { where: { id: dto.id }, returning: true });
  }

  async remove(internal_user_id: number, id: number): Promise<number> {
    const [affectedRows] = await this.paymentModel.update(
      {
        deleted_at: new Date(),
        deleted_by: internal_user_id,
      },
      {
        where: {
          id,
          deleted_at: { [Op.is]: null },
        },
      },
    );
    return affectedRows;
  }

  async updateStatus(
    internal_user_id: number,
    dto: UpdatePaymentStatusDto,
  ): Promise<[number, Payment[]]> {
    return this.paymentModel.update(
      {
        disabled_at: dto.enable ? null : new Date(),
        disabled_by: dto.enable ? null : internal_user_id,
      },
      { where: { id: dto.id }, returning: true },
    );
  }
}