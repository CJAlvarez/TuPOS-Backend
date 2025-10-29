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
exports.CreateReturnDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateReturnDto {
    id_sale;
    id_client;
    id_terminal;
    id_invoice;
    date;
    total;
    reason;
    status;
    id_store;
    return_items;
    _return_items;
}
exports.CreateReturnDto = CreateReturnDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de la venta' }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateReturnDto.prototype, "id_sale", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del cliente' }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateReturnDto.prototype, "id_client", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de la terminal' }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateReturnDto.prototype, "id_terminal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de la factura', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateReturnDto.prototype, "id_invoice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de la devolución' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateReturnDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total de la devolución' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateReturnDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Razón de la devolución', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReturnDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Estado de la devolución' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReturnDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de la tienda', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateReturnDto.prototype, "id_store", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Items de la devolución' }),
    __metadata("design:type", Array)
], CreateReturnDto.prototype, "return_items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Items de la devolución RAW' }),
    __metadata("design:type", Array)
], CreateReturnDto.prototype, "_return_items", void 0);
//# sourceMappingURL=create-return.dto.js.map