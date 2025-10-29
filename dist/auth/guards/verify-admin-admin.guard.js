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
exports.VerifyAdminAdminGuard = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const admin_entity_1 = require("../../entities/admin.entity");
let VerifyAdminAdminGuard = class VerifyAdminAdminGuard {
    adminModel;
    constructor(adminModel) {
        this.adminModel = adminModel;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const { internal_user_id } = request;
        const admin = await this.adminModel.findOne({
            where: {
                id_user: internal_user_id,
                id_admin_type: 1,
            },
        });
        if (!admin) {
            throw new common_1.ForbiddenException({
                title: 'Operación No Permitida',
                message: 'El usuario no tiene permisos para realizar la operación.',
                status: 403,
                code: 'admin',
            });
        }
        request.internal_store_id = admin.getDataValue('id_store');
        return true;
    }
};
exports.VerifyAdminAdminGuard = VerifyAdminAdminGuard;
exports.VerifyAdminAdminGuard = VerifyAdminAdminGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(admin_entity_1.Admin)),
    __metadata("design:paramtypes", [Object])
], VerifyAdminAdminGuard);
//# sourceMappingURL=verify-admin-admin.guard.js.map