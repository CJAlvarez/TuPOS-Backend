"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const report_entity_1 = require("../entities/report.entity");
const sequelize_typescript_1 = require("sequelize-typescript");
const report_enum_1 = require("./enums/report.enum");
let ReportsService = class ReportsService {
    reportModel;
    sequelize;
    constructor(reportModel, sequelize) {
        this.reportModel = reportModel;
        this.sequelize = sequelize;
    }
    createBaseResponse(reportCode, reportName, reportType, data) {
        return {
            reportCode,
            reportName,
            generatedAt: new Date(),
            reportType,
            data,
        };
    }
    async getDailySales(dto, internal_store_id) {
        const reportCode = report_enum_1.ReportCode.DAILY_SALES;
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
        }));
        const data = sales.map((sale) => ({
            date: new Date(sale.date).toISOString(),
            number: sale.number,
            subtotal: Number(sale.subtotal),
            discount_total: Number(sale.discount_total),
            tax_total: Number(sale.tax_total),
            total: Number(sale.total),
        }));
        return this.createBaseResponse(reportCode, 'Ventas Diarias', report_enum_1.ReportType.IMMEDIATE, data);
    }
    async getInventoryLow(dto, internal_store_id) {
        const reportCode = report_enum_1.ReportCode.INVENTORY_LOW;
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
        }));
        const data = items.map((item) => ({
            name: item.name,
            code: item.code,
            min_stock: Number(item.min_stock),
            stock: Number(item.stock),
        }));
        return this.createBaseResponse(reportCode, 'Inventario Bajo', report_enum_1.ReportType.IMMEDIATE, data);
    }
    async getInventoryExpiring(dto, internal_store_id) {
        const reportCode = report_enum_1.ReportCode.INVENTORY_EXPIRING;
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
        }));
        const data = items.map((item) => ({
            name: item.name,
            code: item.code,
            created_at: item.created_at,
            expiration_date: item.expiration_date,
            unit_quantity: Number(item.unit_quantity),
        }));
        return this.createBaseResponse(reportCode, 'Inventario Por Vencer', report_enum_1.ReportType.IMMEDIATE, data);
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(report_entity_1.Report)),
    __metadata("design:paramtypes", [Object, sequelize_typescript_1.Sequelize])
], ReportsService);
//# sourceMappingURL=reports.service.js.map