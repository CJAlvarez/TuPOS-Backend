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
exports.FirstLoginDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class FirstLoginDto {
    password;
    confirm;
    confirmPassword;
    firstname;
    lastname;
    gender;
    phone;
    src;
    email;
}
exports.FirstLoginDto = FirstLoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nueva contraseña' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], FirstLoginDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Confirmación de la nueva contraseña. Nombre de campo usado por el frontend.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FirstLoginDto.prototype, "confirm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Confirmación de la nueva contraseña. Alias aceptado para clientes que no usan "confirm".',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FirstLoginDto.prototype, "confirmPassword", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Nombres del perfil' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], FirstLoginDto.prototype, "firstname", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Apellidos del perfil' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], FirstLoginDto.prototype, "lastname", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Identificador del género. Llega como texto en multipart.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FirstLoginDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Teléfono del perfil' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(30),
    __metadata("design:type", String)
], FirstLoginDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Vista previa del avatar. Puede ser un data URL o el nombre de un recurso por defecto.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FirstLoginDto.prototype, "src", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Correo del usuario. Se acepta por compatibilidad con el formulario, pero no se modifica.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FirstLoginDto.prototype, "email", void 0);
//# sourceMappingURL=first-login.dto.js.map