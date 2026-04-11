import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Report } from '../entities/report.entity';
import { Sequelize } from 'sequelize-typescript';
import { ReportCode, ReportType } from './enums/report.enum';
import {
  DailySalesRequestDto,
  DailySalesResponseDto,
} from './dto/daily-sales-reports.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report)
    private reportModel: typeof Report,
    private sequelize: Sequelize,
  ) {}

  private createBaseResponse(
    reportCode: string,
    reportName: string,
    reportType: string,
    data: any,
  ) {
    return {
      reportCode,
      reportName,
      generatedAt: new Date(),
      reportType,
      data,
    };
  }

  // Reportes de Ventas Diarias
  async getDailySales(
    dto: DailySalesRequestDto,
    internal_store_id: number,
  ): Promise<DailySalesResponseDto> {
    const reportCode = ReportCode.DAILY_SALES;

    const query = `
      SELECT
        s.date,
        s.number,
        s.subtotal,
        s.discount_total,
        s.tax_total,
        s.total
      FROM sales s
      WHERE
      s.id_store = :id_store AND
      s.date BETWEEN :startDate AND :endDate
      ORDER BY s.date ASC
    `;

    const sales = (await this.sequelize.query(query, {
      type: 'SELECT',
      replacements: {
        startDate: dto.startDate,
        endDate: dto.endDate,
        id_store: internal_store_id,
      },
    })) as any[];

    const data = sales.map((sale) => ({
      date: new Date(sale.date).toISOString(),
      number: sale.number,
      subtotal: Number(sale.subtotal),
      discount_total: Number(sale.discount_total),
      tax_total: Number(sale.tax_total),
      total: Number(sale.total),
    }));

    return this.createBaseResponse(
      reportCode,
      'Ventas Diarias',
      ReportType.IMMEDIATE,
      data,
    ) as DailySalesResponseDto;
  }

  async getInventoryLow(dto: any, internal_store_id: number): Promise<any> {
    const reportCode = ReportCode.INVENTORY_LOW;

    const inventoryQuery = `
      SELECT
        i.id_product,
        SUM(i.unit_quantity) AS stock
      FROM inventorys i
      WHERE
      i.id_store = :id_store AND
      (i.expiration_date >= CURDATE() OR i.expiration_date IS NULL)
      GROUP BY i.id_product`;

    const query = `
      SELECT
      p.name,
      p.code,
      p.min_stock,
      invs.stock
      FROM products p
      INNER JOIN (${inventoryQuery}) invs ON invs.id_product = p.id
      WHERE
      p.id_store = :id_store AND
      p.min_stock >= invs.stock AND
      p.disabled_at IS NULL AND
      p.deleted_at IS NULL
    `;

    const items = (await this.sequelize.query(query, {
      type: 'SELECT',
      replacements: {
        id_store: internal_store_id,
      },
    })) as any[];

    const data = items.map((item) => ({
      name: item.name,
      code: item.code,
      min_stock: Number(item.min_stock),
      stock: Number(item.stock),
    }));

    return this.createBaseResponse(
      reportCode,
      'Inventario Bajo',
      ReportType.IMMEDIATE,
      data,
    );
  }

  async getInventoryExpiring(
    dto: any,
    internal_store_id: number,
  ): Promise<any> {
    const reportCode = ReportCode.INVENTORY_EXPIRING;

    // a INVENTORY_DAYS_BEFORE_EXPIRATION de expirar
    const inventoryQuery = `
      SELECT
        i.id_product,
        i.created_at,
        i.expiration_date,
        i.unit_quantity
      FROM inventorys i
      WHERE
      i.id_store = :id_store AND
      i.unit_quantity > 0 AND
      i.expiration_date IS NOT NULL AND
      i.expiration_date <= DATE_ADD(CURDATE(), INTERVAL ${process.env.INVENTORY_DAYS_BEFORE_EXPIRATION} DAY)
      `;

    const query = `
      SELECT
      p.name,
      p.code,
      invs.created_at,
      invs.expiration_date,
      invs.unit_quantity

      FROM products p
      INNER JOIN (${inventoryQuery}) invs ON invs.id_product = p.id
      WHERE
      p.id_store = :id_store AND
      p.disabled_at IS NULL AND
      p.deleted_at IS NULL
    `;

    const items = (await this.sequelize.query(query, {
      type: 'SELECT',
      replacements: {
        id_store: internal_store_id,
      },
    })) as any[];

    const data = items.map((item) => ({
      name: item.name,
      code: item.code,
      created_at: item.created_at,
      expiration_date: item.expiration_date,
      unit_quantity: Number(item.unit_quantity),
    }));

    return this.createBaseResponse(
      reportCode,
      'Inventario Por Vencer',
      ReportType.IMMEDIATE,
      data,
    );
  }
}
