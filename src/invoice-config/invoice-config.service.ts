import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InvoiceConfig } from '../entities/invoice-config.entity';
import { CreateInvoiceConfigDto } from './dto/create-invoice-config.dto';
import { UpdateInvoiceConfigDto } from './dto/update-invoice-config.dto';

@Injectable()
export class InvoiceConfigService {
  constructor(
    @InjectModel(InvoiceConfig)
    private readonly invoiceConfigModel: typeof InvoiceConfig,
  ) {}

  async findAll(id_store?: number) {
    const where: any = {};
    
    if (id_store) {
      where.id_store = id_store;
    }
    
    // Retorna solo el primer registro, como en el original
    const config = await this.invoiceConfigModel.findOne({ where });
    return config;
  }

  async findOne(id: number) {
    const config = await this.invoiceConfigModel.findByPk(id);
    if (!config)
      throw new NotFoundException('Configuración de factura no encontrada');
    return config;
  }

  async create(internal_store_id: number, dto: CreateInvoiceConfigDto) {
    dto.id_store = internal_store_id;
    return this.invoiceConfigModel.create(dto as any);
  }

  async update(dto: UpdateInvoiceConfigDto) {
    const config = await this.invoiceConfigModel.findByPk(1);
    if (!config)
      throw new NotFoundException('Configuración de factura no encontrada');
    await config.update(dto);
    return {
      title: "Configuración de Impresora",
      message: "Configuración actualizada correctamente",
    };
  }

  async remove(id: number) {
    const config = await this.invoiceConfigModel.findByPk(id);
    if (!config)
      throw new NotFoundException('Configuración de factura no encontrada');
    await config.destroy();
    return { message: 'Configuración eliminada' };
  }
}
