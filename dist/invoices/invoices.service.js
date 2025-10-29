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
var InvoicesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicesService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const invoice_entity_1 = require("../entities/invoice.entity");
const invoice_config_entity_1 = require("../entities/invoice-config.entity");
const sequelize_2 = require("sequelize");
const utils_service_1 = require("../utils/utils.service");
let InvoicesService = InvoicesService_1 = class InvoicesService {
    invoiceModel;
    invoiceConfigModel;
    utilsService;
    logger = new common_1.Logger(InvoicesService_1.name);
    constructor(invoiceModel, invoiceConfigModel, utilsService) {
        this.invoiceModel = invoiceModel;
        this.invoiceConfigModel = invoiceConfigModel;
        this.utilsService = utilsService;
    }
    async findAll(query, id_store) {
        const { search_word, limit = 10, skip = 0, order_asc = false, order_by = 'number', } = query;
        const where = {};
        if (id_store) {
            where.id_store = id_store;
        }
        if (search_word) {
            where[sequelize_2.Op.or] = [
                { $number$: { [sequelize_2.Op.like]: `%${search_word}%` } },
                { $client$: { [sequelize_2.Op.like]: `%${search_word}%` } },
                { $title$: { [sequelize_2.Op.like]: `%${search_word}%` } },
                { $total$: { [sequelize_2.Op.like]: `%${search_word}%` } },
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
    async findOne(id) {
        const invoice = await this.invoiceModel.findByPk(id);
        if (!invoice)
            throw new common_1.NotFoundException('Invoice not found');
        return invoice;
    }
    async create(internal_user_id, internal_store_id, dto) {
        dto.id_store = internal_store_id;
        if (dto.number) {
            let exists = await this.invoiceModel.findOne({
                where: {
                    number: dto.number,
                    id_store: internal_store_id
                },
            });
            if (exists) {
                const configRow = await this.invoiceConfigModel.findOne({
                    where: {
                        id: 1,
                        id_store: internal_store_id
                    },
                });
                let nextNumber = +dto.number;
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
                        }
                        else {
                            candidate++;
                        }
                    }
                }
                else {
                    let candidate = Number(dto.number) + 1;
                    let found = false;
                    while (!found) {
                        const conflict = await this.invoiceModel.findOne({
                            where: { number: candidate },
                        });
                        if (!conflict) {
                            found = true;
                            nextNumber = candidate;
                        }
                        else {
                            candidate++;
                        }
                    }
                }
                dto.number = String(nextNumber);
            }
        }
        const invoiceData = {
            ...dto,
            date: dto.date || new Date(),
            items: JSON.stringify(dto.items),
            created_by: internal_user_id,
            created_at: new Date(),
        };
        const invoice = await this.invoiceModel.create(invoiceData);
        const configRow = await this.invoiceConfigModel.findOne({
            where: { id: 1 },
        });
        if (configRow) {
            const config = configRow.getDataValue('config');
            config.number_current = Number(dto.number || 0) + 1;
            configRow.set({ config });
            configRow.changed('config', true);
            await configRow.save();
        }
        else {
            throw new Error('No se encontró la configuración de la factura.');
        }
        const createdInvoice = await this.findOne(invoice.id);
        return {
            title: 'Operación Exitosa',
            message: 'El recibo ha sido creado.',
            invoice: createdInvoice,
        };
    }
    async update(id, dto) {
        const invoice = await this.invoiceModel.findByPk(id);
        if (!invoice)
            throw new common_1.NotFoundException('Invoice not found');
        return invoice.update(dto);
    }
    async remove(id) {
        const invoice = await this.invoiceModel.findByPk(id);
        if (!invoice)
            throw new common_1.NotFoundException('Invoice not found');
        await invoice.destroy();
        return { message: 'Factura eliminada' };
    }
};
exports.InvoicesService = InvoicesService;
exports.InvoicesService = InvoicesService = InvoicesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(invoice_entity_1.Invoice)),
    __param(1, (0, sequelize_1.InjectModel)(invoice_config_entity_1.InvoiceConfig)),
    __metadata("design:paramtypes", [Object, Object, utils_service_1.UtilsService])
], InvoicesService);
//# sourceMappingURL=invoices.service.js.map