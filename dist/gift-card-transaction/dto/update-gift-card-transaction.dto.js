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
exports.UpdateGiftCardTransactionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_gift_card_transaction_dto_1 = require("./create-gift-card-transaction.dto");
const class_validator_1 = require("class-validator");
class UpdateGiftCardTransactionDto extends (0, swagger_1.PartialType)(create_gift_card_transaction_dto_1.CreateGiftCardTransactionDto) {
    id;
}
exports.UpdateGiftCardTransactionDto = UpdateGiftCardTransactionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de la transacción de gift card' }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateGiftCardTransactionDto.prototype, "id", void 0);
//# sourceMappingURL=update-gift-card-transaction.dto.js.map