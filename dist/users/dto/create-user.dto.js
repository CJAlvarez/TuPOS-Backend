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
exports.CreateUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const user_admin_dto_1 = require("./user-admin.dto");
const profile_admin_dto_1 = require("./profile-admin.dto");
class CreateUserDto {
    user;
    profile;
    id_admin_type;
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: () => user_admin_dto_1.UserAdminDto,
        description: 'Datos de usuario para el administrador',
    }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => user_admin_dto_1.UserAdminDto),
    __metadata("design:type", user_admin_dto_1.UserAdminDto)
], CreateUserDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: () => profile_admin_dto_1.ProfileAdminDto,
        description: 'Datos de perfil para el administrador',
    }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => profile_admin_dto_1.ProfileAdminDto),
    __metadata("design:type", profile_admin_dto_1.ProfileAdminDto)
], CreateUserDto.prototype, "profile", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tipo de administrador' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateUserDto.prototype, "id_admin_type", void 0);
//# sourceMappingURL=create-user.dto.js.map