import { Notification } from '../entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { GetNotificationsQueryDto } from './dto/get-notifications-query.dto';
import { UpdateNotificationStatusDto } from './dto/update-notification-status.dto';
import { UpdateNotificationSeenDto } from './dto/update-notification-seen.dto';
import { UpdateNotificationArchivedDto } from './dto/update-notification-archived.dto';
import { UtilsService } from 'src/utils/utils.service';
export declare class NotificationService {
    private readonly notificationModel;
    private readonly utilsService;
    constructor(notificationModel: typeof Notification, utilsService: UtilsService);
    findAll(query: GetNotificationsQueryDto, id_store?: number): Promise<{
        count: number;
        list: Notification[];
        skip: number;
    }>;
    findOne(id: number, storeId: number): Promise<Notification | null>;
    create(internal_user_id: number, internal_store_id: number, dto: CreateNotificationDto): Promise<Notification>;
    update(dto: UpdateNotificationDto, storeId: number): Promise<[number, Notification[]]>;
    remove(internal_user_id: number, id: number, storeId: number): Promise<any>;
    updateStatus(internal_user_id: number, dto: UpdateNotificationStatusDto, storeId: number): Promise<[number, Notification[]]>;
    updateSeen(internal_user_id: number, dto: UpdateNotificationSeenDto, storeId: number): Promise<[number, Notification[]]>;
    updateArchived(internal_user_id: number, dto: UpdateNotificationArchivedDto, storeId: number): Promise<[number, Notification[]]>;
}
