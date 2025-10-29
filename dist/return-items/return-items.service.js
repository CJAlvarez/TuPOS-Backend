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
exports.ReturnItemsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const return_item_entity_1 = require("../entities/return-item.entity");
const utils_service_1 = require("../utils/utils.service");
let ReturnItemsService = class ReturnItemsService {
    returnItemModel;
    utilsService;
    constructor(returnItemModel, utilsService) {
        this.returnItemModel = returnItemModel;
        this.utilsService = utilsService;
    }
    async create(dto, internal_user_id) {
        return this.returnItemModel.create({ ...dto });
    }
    async findAll(query) {
        const { limit = 10, skip = 0 } = query;
        const where = {};
        where.deleted_at = { [sequelize_2.Op.is]: null };
        const total = await this.returnItemModel.count({ where });
        const paginate = this.utilsService.paginate(limit, skip, total, false);
        const rows = await this.returnItemModel.findAll({
            where,
            limit: paginate.limit,
            offset: paginate.offset,
            order: [['id', 'DESC']],
        });
        return {
            count: total,
            list: rows.map((row) => row.toJSON()),
            skip: paginate.skip,
        };
    }
    async findOne(id) {
        const item = await this.returnItemModel.findOne({
            where: {
                id,
                deleted_at: { [sequelize_2.Op.is]: null },
            },
        });
        if (!item)
            throw new common_1.NotFoundException('Return item not found');
        return item;
    }
    async update(dto, internal_user_id) {
        const [affectedRows, [updated]] = await this.returnItemModel.update({ ...dto }, {
            where: {
                id: dto.id,
                deleted_at: { [sequelize_2.Op.is]: null },
            },
            returning: true,
        });
        if (!affectedRows)
            throw new common_1.NotFoundException('Return item not found');
        return updated;
    }
    async remove(internal_user_id, id) {
        const [affectedRows] = await this.returnItemModel.update({
            deleted_at: new Date(),
            deleted_by: internal_user_id,
        }, {
            where: {
                id,
                deleted_at: { [sequelize_2.Op.is]: null },
            },
        });
        return affectedRows;
    }
    async updateStatus(internal_user_id, dto) {
        return this.returnItemModel.update({
            disabled_at: dto.enable ? null : new Date(),
            disabled_by: dto.enable ? null : internal_user_id,
        }, { where: { id: dto.id }, returning: true });
    }
};
exports.ReturnItemsService = ReturnItemsService;
exports.ReturnItemsService = ReturnItemsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(return_item_entity_1.ReturnItem)),
    __metadata("design:paramtypes", [Object, utils_service_1.UtilsService])
], ReturnItemsService);
//# sourceMappingURL=return-items.service.js.map