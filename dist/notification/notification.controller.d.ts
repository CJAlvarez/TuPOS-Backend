import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { GetNotificationsQueryDto } from './dto/get-notifications-query.dto';
import { UpdateNotificationStatusDto } from './dto/update-notification-status.dto';
import { UpdateNotificationSeenDto } from './dto/update-notification-seen.dto';
import { UpdateNotificationArchivedDto } from './dto/update-notification-archived.dto';
import { Notification } from '../entities/notification.entity';
import { NotificationService } from './notification.service';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    findAll(req: any, query: GetNotificationsQueryDto): Promise<any>;
    findOne(id: string): Promise<Notification | null>;
    create(req: any, data: CreateNotificationDto): Promise<Notification>;
    update(dto: UpdateNotificationDto): Promise<[number, Notification[]]>;
    remove(req: any, id: string): Promise<number>;
    updateStatus(req: any, dto: UpdateNotificationStatusDto): Promise<[number, Notification[]]>;
    updateSeen(req: any, dto: UpdateNotificationSeenDto): Promise<[number, Notification[]]>;
    updateArchived(req: any, dto: UpdateNotificationArchivedDto): Promise<[number, Notification[]]>;
}
