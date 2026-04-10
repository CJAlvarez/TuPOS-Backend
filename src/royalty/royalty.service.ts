import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Royalty } from '../entities/royalty.entity';
import { CreateRoyaltyDto } from './dto/create-royalty.dto';
import { UpdateRoyaltyDto } from './dto/update-royalty.dto';
import { GetRoyaltiesQueryDto } from './dto/get-royalties-query.dto';
import { UpdateRoyaltyStatusDto } from './dto/update-royalty-status.dto';
import { Op } from 'sequelize';
import { UtilsService } from 'src/utils/utils.service';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class RoyaltyService {
  constructor(
    @InjectModel(Royalty)
    private readonly royaltyModel: typeof Royalty,
    private readonly utilsService: UtilsService,
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(query: GetRoyaltiesQueryDto, id_store?: number) {
    const { limit = 10, skip = 0, id_client } = query;
    const where: any = {
      points: { [Op.gt]: 0 },
      disabled_at: null,
      deleted_at: null,
      [Op.or]: [
        { expire_at: { [Op.gte]: new Date() } },
        { expire_at: { [Op.eq]: null } },
      ],
    };
    if (id_store) where.id_store = id_store;
    if (id_client) where.id_client = id_client;

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

  async findOne(id: number): Promise<Royalty | null> {
    return this.royaltyModel.findOne({ where: { id } });
  }

  async create(
    internal_user_id: number,
    internal_store_id: number,
    dto: CreateRoyaltyDto,
  ): Promise<Royalty> {
    dto.created_by = internal_user_id;
    dto.id_store = internal_store_id;
    return this.royaltyModel.create(dto as any);
  }

  async update(dto: UpdateRoyaltyDto): Promise<[number, Royalty[]]> {
    return this.royaltyModel.update(dto, {
      where: { id: dto.id },
      returning: true,
    });
  }

  async remove(internal_user_id: number, id: number): Promise<any> {
    await this.royaltyModel.update(
      {
        deleted_at: new Date(),
        deleted_by: internal_user_id,
      },
      {
        where: {
          id,
          deleted_at: { [Op.is]: null },
        },
      },
    );
    return { title: 'Operación exitosa' };
  }

  async updateStatus(
    internal_user_id: number,
    dto: UpdateRoyaltyStatusDto,
  ): Promise<[number, Royalty[]]> {
    return this.royaltyModel.update(
      {
        disabled_at: dto.enable ? null : new Date(),
        disabled_by: dto.enable ? null : internal_user_id,
      },
      { where: { id: dto.id }, returning: true },
    );
  }

  async processRoyalty(dto, transaction) {
    const royaltyAmount = dto?.payment?.loyalty_points || 0;

    if (!royaltyAmount || royaltyAmount <= 0) {
      return {
        moneyAmount: dto.payment.amount,
        pointsUsed: 0,
      };
    }

    const totalPoints = await this.getAvailablePoints(
      dto.id_client,
      transaction,
    );

    this.validateMinUse(totalPoints);

    if (royaltyAmount > totalPoints) {
      throw new BadRequestException('Puntos insuficientes');
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
        points: { [Op.gt]: 0 },
        disabled_at: null,
        deleted_at: null,
        [Op.or]: [
          { expire_at: { [Op.gte]: new Date() } },
          { expire_at: { [Op.eq]: null } },
        ],
      },
      transaction,
    });

    return rows.reduce((sum, r) => sum + Number(r.getDataValue('points')), 0);
  }

  private validateMinUse(totalPoints) {
    const min = Number(process.env.ROYALTY_MIN_USE || 0);

    if (totalPoints < min) {
      throw new BadRequestException(
        `Debe tener al menos ${min} puntos para usar`,
      );
    }
  }

  async consumePointsFIFO(clientId, pointsToUse, transaction) {
    const rows = await this.royaltyModel.findAll({
      where: {
        id_client: clientId,
        points: { [Op.gt]: 0 },
        disabled_at: null,
        deleted_at: null,
        [Op.or]: [
          { expire_at: { [Op.gte]: new Date() } },
          { expire_at: { [Op.eq]: null } },
        ],
      },
      order: [['created_at', 'ASC']],
      lock: true,
      transaction,
    });

    let remaining = pointsToUse;

    const updates: any[] = [];

    for (const r of rows) {
      if (remaining <= 0) break;

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

  private async bulkUpdatePoints(updates, transaction) {
    if (!updates.length) return;

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

  async generatePoints(
    clientId,
    moneyAmount,
    saleId,
    userId,
    storeId,
    transaction,
  ) {
    if (moneyAmount <= 0) return;

    const rate = Number(process.env.ROYALTY_SALE_RATE || 0);

    const points = moneyAmount * rate;

    if (points <= 0) return;

    await this.royaltyModel.create(
      {
        id_client: clientId,
        id_sale: saleId,
        points,
        created_by: userId,
        id_store: storeId,
        expire_at: this.calculateExpireDate(),
      } as any,
      { transaction },
    );
  }

  private calculateExpireDate() {
    const months = Number(process.env.ROYALTY_EXPIRE_MONTHS || 0);

    if (!months || months <= 0) {
      return null;
    }

    return this.sequelize.literal(
      `DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ${months} MONTH)`,
    );
  }
}
