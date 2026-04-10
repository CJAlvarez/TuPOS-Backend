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
exports.RoyaltyService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const royalty_entity_1 = require("../entities/royalty.entity");
const sequelize_2 = require("sequelize");
const utils_service_1 = require("../utils/utils.service");
const sequelize_typescript_1 = require("sequelize-typescript");
let RoyaltyService = class RoyaltyService {
    royaltyModel;
    utilsService;
    sequelize;
    constructor(royaltyModel, utilsService, sequelize) {
        this.royaltyModel = royaltyModel;
        this.utilsService = utilsService;
        this.sequelize = sequelize;
    }
    async findAll(query, id_store) {
        const { limit = 10, skip = 0, id_client } = query;
        const where = {
            points: { [sequelize_2.Op.gt]: 0 },
            disabled_at: null,
            deleted_at: null,
            [sequelize_2.Op.or]: [
                { expire_at: { [sequelize_2.Op.gte]: new Date() } },
                { expire_at: { [sequelize_2.Op.eq]: null } },
            ],
        };
        if (id_store)
            where.id_store = id_store;
        if (id_client)
            where.id_client = id_client;
        const total = await this.royaltyModel.count({ where });
        const paginate = this.utilsService.paginate(limit, skip, total, false);
        const rows = await this.royaltyModel.findAll({
            where,
            limit: paginate.limit,
            offset: paginate.offset,
        });
        return {
            count: total,
            list: rows.map((row) => row.toJSON()),
            skip: paginate.skip,
        };
    }
    async findOne(id) {
        return this.royaltyModel.findOne({ where: { id } });
    }
    async create(internal_user_id, internal_store_id, dto) {
        dto.created_by = internal_user_id;
        dto.id_store = internal_store_id;
        return this.royaltyModel.create(dto);
    }
    async update(dto) {
        return this.royaltyModel.update(dto, {
            where: { id: dto.id },
            returning: true,
        });
    }
    async remove(internal_user_id, id) {
        await this.royaltyModel.update({
            deleted_at: new Date(),
            deleted_by: internal_user_id,
        }, {
            where: {
                id,
                deleted_at: { [sequelize_2.Op.is]: null },
            },
        });
        return { title: 'Operación exitosa' };
    }
    async updateStatus(internal_user_id, dto) {
        return this.royaltyModel.update({
            disabled_at: dto.enable ? null : new Date(),
            disabled_by: dto.enable ? null : internal_user_id,
        }, { where: { id: dto.id }, returning: true });
    }
    async processRoyalty(dto, transaction) {
        const royaltyAmount = dto?.payment?.loyalty_points || 0;
        if (!royaltyAmount || royaltyAmount <= 0) {
            return {
                moneyAmount: dto.payment.amount,
                pointsUsed: 0,
            };
        }
        const totalPoints = await this.getAvailablePoints(dto.id_client, transaction);
        this.validateMinUse(totalPoints);
        if (royaltyAmount > totalPoints) {
            throw new common_1.BadRequestException('Puntos insuficientes');
        }
        await this.consumePointsFIFO(dto.id_client, royaltyAmount, transaction);
        return {
            moneyAmount: dto.payment.amount - royaltyAmount,
            pointsUsed: royaltyAmount,
        };
    }
    async getAvailablePoints(clientId, transaction) {
        const rows = await this.royaltyModel.findAll({
            where: {
                id_client: clientId,
                points: { [sequelize_2.Op.gt]: 0 },
                disabled_at: null,
                deleted_at: null,
                [sequelize_2.Op.or]: [
                    { expire_at: { [sequelize_2.Op.gte]: new Date() } },
                    { expire_at: { [sequelize_2.Op.eq]: null } },
                ],
            },
            transaction,
        });
        return rows.reduce((sum, r) => sum + Number(r.getDataValue('points')), 0);
    }
    validateMinUse(totalPoints) {
        const min = Number(process.env.ROYALTY_MIN_USE || 0);
        if (totalPoints < min) {
            throw new common_1.BadRequestException(`Debe tener al menos ${min} puntos para usar`);
        }
    }
    async consumePointsFIFO(clientId, pointsToUse, transaction) {
        const rows = await this.royaltyModel.findAll({
            where: {
                id_client: clientId,
                points: { [sequelize_2.Op.gt]: 0 },
                disabled_at: null,
                deleted_at: null,
                [sequelize_2.Op.or]: [
                    { expire_at: { [sequelize_2.Op.gte]: new Date() } },
                    { expire_at: { [sequelize_2.Op.eq]: null } },
                ],
            },
            order: [['created_at', 'ASC']],
            lock: true,
            transaction,
        });
        let remaining = pointsToUse;
        const updates = [];
        for (const r of rows) {
            if (remaining <= 0)
                break;
            const current = Number(r.getDataValue('points'));
            const take = Math.min(current, remaining);
            updates.push({
                id: r.id,
                newPoints: current - take,
            });
            remaining -= take;
        }
        await this.bulkUpdatePoints(updates, transaction);
    }
    async bulkUpdatePoints(updates, transaction) {
        if (!updates.length)
            return;
        const ids = updates.map((u) => u.id);
        const cases = updates
            .map((u) => `WHEN ${u.id} THEN ${u.newPoints}`)
            .join(' ');
        const sql = `
    UPDATE royalties
    SET points = CASE id
      ${cases}
    END
    WHERE id IN (${ids.join(',')})
  `;
        await this.sequelize.query(sql, { transaction });
    }
    async generatePoints(clientId, moneyAmount, saleId, userId, storeId, transaction) {
        if (moneyAmount <= 0)
            return;
        const rate = Number(process.env.ROYALTY_SALE_RATE || 0);
        const points = moneyAmount * rate;
        if (points <= 0)
            return;
        await this.royaltyModel.create({
            id_client: clientId,
            id_sale: saleId,
            points,
            created_by: userId,
            id_store: storeId,
            expire_at: this.calculateExpireDate(),
        }, { transaction });
    }
    calculateExpireDate() {
        const months = Number(process.env.ROYALTY_EXPIRE_MONTHS || 0);
        if (!months || months <= 0) {
            return null;
        }
        return this.sequelize.literal(`DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ${months} MONTH)`);
    }
};
exports.RoyaltyService = RoyaltyService;
exports.RoyaltyService = RoyaltyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(royalty_entity_1.Royalty)),
    __metadata("design:paramtypes", [Object, utils_service_1.UtilsService,
        sequelize_typescript_1.Sequelize])
], RoyaltyService);
//# sourceMappingURL=royalty.service.js.map