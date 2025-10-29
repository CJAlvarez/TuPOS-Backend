import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Notification } from '../entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { GetNotificationsQueryDto } from './dto/get-notifications-query.dto';
import { UpdateNotificationStatusDto } from './dto/update-notification-status.dto';
import { UpdateNotificationSeenDto } from './dto/update-notification-seen.dto';
import { UpdateNotificationArchivedDto } from './dto/update-notification-archived.dto';
import { UpdateNotificationDeletedDto } from './dto/update-notification-deleted.dto';
import { Op } from 'sequelize';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification)
    private readonly notificationModel: typeof Notification,
    private readonly utilsService: UtilsService,
  ) {}

  async findAll(query: GetNotificationsQueryDto, id_store?: number) {
    const { search_word, limit = 10, skip = 0 } = query;
    const where: any = {};
    
    if (id_store) {
      where.id_store = id_store;
    }
    
    if (search_word) {
      where[Op.or] = [
        { $id$: { [Op.like]: `%${search_word}%` } },
        { $subject$: { [Op.like]: `%${search_word}%` } },
      ];
    }
    const total = await this.notificationModel.count({ where });
    const paginate = this.utilsService.paginate(limit, skip, total, false);
    const rows = await this.notificationModel.findAll({
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

  async findOne(id: number): Promise<Notification | null> {
    return this.notificationModel.findOne({ where: { id } });
  }

  async create(
    internal_user_id: number,
    internal_store_id: number,
    dto: CreateNotificationDto,
  ): Promise<Notification> {
    dto.created_by = internal_user_id;
    dto.id_store = internal_store_id;
    return this.notificationModel.create(dto as any);
  }

  async update(dto: UpdateNotificationDto): Promise<[number, Notification[]]> {
    return this.notificationModel.update(dto, {
      where: { id: dto.id },
      returning: true,
    });
  }

  async remove(internal_user_id: number, id: number): Promise<number> {
    const [affectedRows] = await this.notificationModel.update(
      {
        deleted_by: internal_user_id,
        deleted_at: new Date(),
      },
      {
        where: {
          id,
          deleted_at: { [Op.is]: null as any },
        },
      },
    );
    return affectedRows;
  }

  async updateStatus(
    internal_user_id: number,
    dto: UpdateNotificationStatusDto,
  ): Promise<[number, Notification[]]> {
    return this.notificationModel.update(
      {
        id_status: dto.status,
      },
      { where: { id: dto.id }, returning: true },
    );
  }

  async updateSeen(
    internal_user_id: number,
    dto: UpdateNotificationSeenDto,
  ): Promise<[number, Notification[]]> {
    return this.notificationModel.update(
      {
        seen_by: internal_user_id,
        seen_at: new Date(),
      },
      { where: { id: dto.id }, returning: true },
    );
  }

  async updateArchived(
    internal_user_id: number,
    dto: UpdateNotificationArchivedDto,
  ): Promise<[number, Notification[]]> {
    return this.notificationModel.update(
      {
        archived_by: internal_user_id,
        archived_at: new Date(),
      },
      { where: { id: dto.id }, returning: true },
    );
  }
}
