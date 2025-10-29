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
exports.ProfileClientDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class ProfileClientDto {
    firstname;
    lastname;
    id_gender;
    id_country;
    identification;
    phone;
    address;
    image;
}
exports.ProfileClientDto = ProfileClientDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombres del cliente' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProfileClientDto.prototype, "firstname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Apellidos del cliente' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProfileClientDto.prototype, "lastname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de género' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], ProfileClientDto.prototype, "id_gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de país' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], ProfileClientDto.prototype, "id_country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Identificación' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProfileClientDto.prototype, "identification", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Teléfono' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ProfileClientDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Dirección' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ProfileClientDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Imagen de perfil' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ProfileClientDto.prototype, "image", void 0);
//# sourceMappingURL=profile-client.dto.js.map