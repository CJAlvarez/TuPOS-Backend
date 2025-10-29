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
exports.CreateClientDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const user_client_dto_1 = require("./user-client.dto");
const profile_client_dto_1 = require("./profile-client.dto");
const swagger_1 = require("@nestjs/swagger");
class CreateClientDto {
    user;
    profile;
}
exports.CreateClientDto = CreateClientDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: () => user_client_dto_1.UserClientDto,
        description: 'Datos de usuario para el cliente',
    }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => user_client_dto_1.UserClientDto),
    __metadata("design:type", user_client_dto_1.UserClientDto)
], CreateClientDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: () => profile_client_dto_1.ProfileClientDto,
        description: 'Datos de perfil para el cliente',
    }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => profile_client_dto_1.ProfileClientDto),
    __metadata("design:type", profile_client_dto_1.ProfileClientDto)
], CreateClientDto.prototype, "profile", void 0);
//# sourceMappingURL=create-client.dto.js.map