import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Invoice } from '../entities/invoice.entity';
import { InvoiceConfig } from '../entities/invoice-config.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Op } from 'sequelize';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class InvoicesService {
  private readonly logger = new Logger(InvoicesService.name);

  constructor(
    @InjectModel(Invoice)
    private readonly invoiceModel: typeof Invoice,
    @InjectModel(InvoiceConfig)
    private readonly invoiceConfigModel: typeof InvoiceConfig,
    private readonly utilsService: UtilsService,
  ) {}

  async findAll(
    query: any,
    id_store?: number,
  ): Promise<{ count: number; list: Invoice[]; skip: number }> {
    const {
      search_word,
      limit = 10,
      skip = 0,
      order_asc = false,
      order_by = 'number',
    } = query;

    const where: any = {};
    
    if (id_store) {
      where.id_store = id_store;
    }
    
    if (search_word) {
      where[Op.or] = [
        { $number$: { [Op.like]: `%${search_word}%` } },
        { $client$: { [Op.like]: `%${search_word}%` } },
        { $title$: { [Op.like]: `%${search_word}%` } },
        { $total$: { [Op.like]: `%${search_word}%` } },
      ];
    }

    const total = await this.invoiceModel.count({
      where,
    });
    const paginate = this.utilsService.paginate(limit, skip, total, false);
    const rows = await this.invoiceModel.findAll({
      where,
      limit: paginate.limit,
      offset: paginate.offset,
      order: [
        order_by === 'number' || order_by === 'total'
          ? [
              this.invoiceModel.sequelize?.literal(`CAST(${order_by} AS UNSIGNED)`),
              order_asc == 'true' ? 'ASC' : 'DESC',
            ]
          : [order_by, order_asc == 'true' ? 'ASC' : 'DESC'],
      ],
    });
    return {
      count: total,
      list: rows.map((row) => row.toJSON()),
      skip: paginate.skip,
    };
  }

  async findOne(id: number): Promise<Invoice> {
    const invoice = await this.invoiceModel.findByPk(id);
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  async create(internal_user_id: any, internal_store_id: number, dto: CreateInvoiceDto): Promise<any> {
    // Agregar el store_id al DTO
    dto.id_store = internal_store_id;
    
    // Paso 1: Validar que el número de factura no esté repetido
    if (dto.number) {
      let exists = await this.invoiceModel.findOne({
        where: { 
          number: dto.number,
          id_store: internal_store_id
        },
      });
      if (exists) {
        // Buscar el siguiente número disponible y usarlo automáticamente
        const configRow = await this.invoiceConfigModel.findOne({
          where: { 
            id: 1,
            id_store: internal_store_id
          },
        });
        let nextNumber: number = +dto.number;
        if (configRow) {
          const config = configRow.getDataValue('config');
          let candidate = Number(config.number_current || 1);
          let found = false;
          while (!found) {
            const conflict = await this.invoiceModel.findOne({
              where: { number: candidate },
            });
            if (!conflict) {
              found = true;
              nextNumber = candidate;
            } else {
              candidate++;
            }
          }
        } else {
          let candidate = Number(dto.number) + 1;
          let found = false;
          while (!found) {
            const conflict = await this.invoiceModel.findOne({
              where: { number: candidate },
            });
            if (!conflict) {
              found = true;
              nextNumber = candidate;
            } else {
              candidate++;
            }
          }
        }
        dto.number = String(nextNumber);
      }
    }

    // Paso 2: Insertar la factura en la base de datos
    // Si la fecha no viene, usar la fecha actual
    const invoiceData = {
      ...dto,
      date: dto.date || new Date(),
      items: JSON.stringify(dto.items),
      created_by: internal_user_id,
      created_at: new Date(),
    };
    const invoice = await this.invoiceModel.create(invoiceData as any);

    // Paso 3: Actualizar el número actual en la configuración de factura
    const configRow = await this.invoiceConfigModel.findOne({
      where: { id: 1 },
    });
    if (configRow) {
      const config = configRow.getDataValue('config');
      config.number_current = Number(dto.number || 0) + 1;
      configRow.set({ config });
      configRow.changed('config', true);
      await configRow.save();
    } else {
      throw new Error('No se encontró la configuración de la factura.');
    }

    // Paso 4: Retornar la factura recién creada
    const createdInvoice = await this.findOne(invoice.id);
    return {
      title: 'Operación Exitosa',
      message: 'El recibo ha sido creado.',
      invoice: createdInvoice,
    };
  }

  async update(id: number, dto: UpdateInvoiceDto): Promise<Invoice> {
    const invoice = await this.invoiceModel.findByPk(id);
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice.update(dto as any);
  }

  async remove(id: number): Promise<{ message: string }> {
    const invoice = await this.invoiceModel.findByPk(id);
    if (!invoice) throw new NotFoundException('Invoice not found');
    await invoice.destroy();
    return { message: 'Factura eliminada' };
  }
}
