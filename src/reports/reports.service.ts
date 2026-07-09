import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Report } from '../entities/report.entity';
import { Sequelize } from 'sequelize-typescript';
import { ReportCode, ReportType } from './enums/report.enum';
import {
  DailySalesRequestDto,
  DailySalesResponseDto,
} from './dto/daily-sales-reports.dto';
import {
  MonthlySalesRequestDto,
  MonthlySalesResponseDto,
} from './dto/monthly-sales-reports.dto';

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

  private async getSalesRows(
    internal_store_id: number,
    startDate: string | Date | undefined,
    endDate: string | Date | undefined,
  ) {
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
        startDate,
        endDate,
        id_store: internal_store_id,
      },
    })) as any[];

    return sales.map((sale) => ({
      date: new Date(sale.date).toISOString(),
      number: sale.number,
      subtotal: Number(sale.subtotal),
      discount_total: Number(sale.discount_total),
      tax_total: Number(sale.tax_total),
      total: Number(sale.total),
    }));
  }

  // Reportes de Ventas Diarias
  async getDailySales(
    dto: DailySalesRequestDto,
    internal_store_id: number,
  ): Promise<DailySalesResponseDto> {
    const reportCode = ReportCode.DAILY_SALES;

    const data = await this.getSalesRows(
      internal_store_id,
      dto.startDate,
      dto.endDate,
    );

    return this.createBaseResponse(
      reportCode,
      'Ventas Diarias',
      ReportType.IMMEDIATE,
      data,
    ) as DailySalesResponseDto;
  }

  // Reportes de Venta Mensual
  async getMonthlySales(
    dto: MonthlySalesRequestDto,
    internal_store_id: number,
  ): Promise<MonthlySalesResponseDto> {
    const reportCode = ReportCode.MONTHLY_SALES;

    const startDate = new Date(dto.year, dto.month - 1, 1, 0, 0, 0, 0);
    const endDate = new Date(dto.year, dto.month, 0, 23, 59, 59, 999);

    let data: any[];

    if (dto.mode === 'summary') {
      const query = `
        SELECT
          DATE(s.date) AS date,
          COUNT(*) AS sales_count,
          SUM(s.subtotal) AS subtotal,
          SUM(s.discount_total) AS discount_total,
          SUM(s.tax_total) AS tax_total,
          SUM(s.total) AS total
        FROM sales s
        WHERE
        s.id_store = :id_store AND
        s.date BETWEEN :startDate AND :endDate
        GROUP BY DATE(s.date)
        ORDER BY date ASC
      `;

      const rows = (await this.sequelize.query(query, {
        type: 'SELECT',
        replacements: {
          startDate,
          endDate,
          id_store: internal_store_id,
        },
      })) as any[];

      data = rows.map((row) => ({
        date: new Date(row.date).toISOString(),
        sales_count: Number(row.sales_count),
        subtotal: Number(row.subtotal),
        discount_total: Number(row.discount_total),
        tax_total: Number(row.tax_total),
        total: Number(row.total),
      }));
    } else {
      data = await this.getSalesRows(internal_store_id, startDate, endDate);
    }

    return this.createBaseResponse(
      reportCode,
      'Venta Mensual',
      ReportType.IMMEDIATE,
      data,
    ) as MonthlySalesResponseDto;
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
