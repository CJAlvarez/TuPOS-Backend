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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSaleDto = exports.PaymentDto = exports.AppliedGiftCardDto = exports.SaleItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class SaleItemDto {
    id_product;
    quantity;
    price;
    discount;
    tax;
    total;
    sale_type;
}
exports.SaleItemDto = SaleItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del producto' }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], SaleItemDto.prototype, "id_product", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cantidad (en unidades o cajas según sale_type)' }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], SaleItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Precio base unitario/caja' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SaleItemDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Descuento total aplicado' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SaleItemDto.prototype, "discount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Impuesto calculado' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SaleItemDto.prototype, "tax", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total del item' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SaleItemDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tipo de venta: unit o box', enum: ['unit', 'box'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['unit', 'box']),
    __metadata("design:type", String)
], SaleItemDto.prototype, "sale_type", void 0);
class AppliedGiftCardDto {
    id_gift_card;
    amount_used;
}
exports.AppliedGiftCardDto = AppliedGiftCardDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de la tarjeta de regalo' }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], AppliedGiftCardDto.prototype, "id_gift_card", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Monto usado de la tarjeta' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AppliedGiftCardDto.prototype, "amount_used", void 0);
class PaymentDto {
    id_payment_method;
    amount;
    reference;
    notes;
}
exports.PaymentDto = PaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del método de pago' }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], PaymentDto.prototype, "id_payment_method", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Monto pagado' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PaymentDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Referencia del pago (número de transacción, cheque, etc.)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaymentDto.prototype, "reference", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Notas del pago' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaymentDto.prototype, "notes", void 0);
class CreateSaleDto {
    id_client;
    subtotal;
    discount_total;
    tax_total;
    total;
    date;
    items;
    gift_cards;
    payment;
    id_payment_method;
    id_status;
    notes;
    tax_included;
    created_by;
    id_store;
}
exports.CreateSaleDto = CreateSaleDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID del cliente (opcional)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Object)
], CreateSaleDto.prototype, "id_client", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Subtotal de la venta' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSaleDto.prototype, "subtotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total de descuentos' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSaleDto.prototype, "discount_total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total de impuestos' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSaleDto.prototype, "tax_total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total de la venta' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSaleDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de la venta' }),
    __metadata("design:type", Date)
], CreateSaleDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Items de la venta', type: [SaleItemDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SaleItemDto),
    __metadata("design:type", Array)
], CreateSaleDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tarjetas de regalo aplicadas', type: [AppliedGiftCardDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => AppliedGiftCardDto),
    __metadata("design:type", Array)
], CreateSaleDto.prototype, "gift_cards", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Información del pago', type: PaymentDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PaymentDto),
    __metadata("design:type", PaymentDto)
], CreateSaleDto.prototype, "payment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Método de pago (deprecated, usar payment.id_payment_method)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateSaleDto.prototype, "id_payment_method", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Estado de la venta' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateSaleDto.prototype, "id_status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Notas adicionales' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSaleDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Si el precio incluye impuestos' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateSaleDto.prototype, "tax_included", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateSaleDto.prototype, "created_by", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID de la tienda' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateSaleDto.prototype, "id_store", void 0);
//# sourceMappingURL=create-sale.dto.js.map