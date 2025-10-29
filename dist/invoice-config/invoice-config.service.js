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
exports.InvoiceConfigService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const invoice_config_entity_1 = require("../entities/invoice-config.entity");
let InvoiceConfigService = class InvoiceConfigService {
    invoiceConfigModel;
    constructor(invoiceConfigModel) {
        this.invoiceConfigModel = invoiceConfigModel;
    }
    async findAll(id_store) {
        const where = {};
        if (id_store) {
            where.id_store = id_store;
        }
        const config = await this.invoiceConfigModel.findOne({ where });
        return config;
    }
    async findOne(id) {
        const config = await this.invoiceConfigModel.findByPk(id);
        if (!config)
            throw new common_1.NotFoundException('Configuración de factura no encontrada');
        return config;
    }
    async create(internal_store_id, dto) {
        dto.id_store = internal_store_id;
        return this.invoiceConfigModel.create(dto);
    }
    async update(dto) {
        const config = await this.invoiceConfigModel.findByPk(1);
        if (!config)
            throw new common_1.NotFoundException('Configuración de factura no encontrada');
        await config.update(dto);
        return {
            title: "Configuración de Impresora",
            message: "Configuración actualizada correctamente",
        };
    }
    async remove(id) {
        const config = await this.invoiceConfigModel.findByPk(id);
        if (!config)
            throw new common_1.NotFoundException('Configuración de factura no encontrada');
        await config.destroy();
        return { message: 'Configuración eliminada' };
    }
};
exports.InvoiceConfigService = InvoiceConfigService;
exports.InvoiceConfigService = InvoiceConfigService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(invoice_config_entity_1.InvoiceConfig)),
    __metadata("design:paramtypes", [Object])
], InvoiceConfigService);
//# sourceMappingURL=invoice-config.service.js.map