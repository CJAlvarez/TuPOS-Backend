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
exports.NotificationController = void 0;
const common_1 = require("@nestjs/common");
const create_notification_dto_1 = require("./dto/create-notification.dto");
const update_notification_dto_1 = require("./dto/update-notification.dto");
const get_notifications_query_dto_1 = require("./dto/get-notifications-query.dto");
const update_notification_status_dto_1 = require("./dto/update-notification-status.dto");
const update_notification_seen_dto_1 = require("./dto/update-notification-seen.dto");
const update_notification_archived_dto_1 = require("./dto/update-notification-archived.dto");
const swagger_1 = require("@nestjs/swagger");
const notification_entity_1 = require("../entities/notification.entity");
const notification_service_1 = require("./notification.service");
const verify_token_guard_1 = require("../auth/guards/verify-token.guard");
const verify_disabled_user_guard_1 = require("../auth/guards/verify-disabled-user.guard");
const verify_admin_admin_guard_1 = require("../auth/guards/verify-admin-admin.guard");
let NotificationController = class NotificationController {
    notificationService;
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    findAll(req, query) {
        return this.notificationService.findAll(query, req.internal_store_id);
    }
    findOne(id) {
        return this.notificationService.findOne(Number(id));
    }
    create(req, data) {
        return this.notificationService.create(req.internal_user_id, req.internal_store_id, data);
    }
    update(dto) {
        return this.notificationService.update(dto);
    }
    remove(req, id) {
        return this.notificationService.remove(req.internal_user_id, Number(id));
    }
    updateStatus(req, dto) {
        return this.notificationService.updateStatus(req.internal_user_id, dto);
    }
    updateSeen(req, dto) {
        return this.notificationService.updateSeen(req.internal_user_id, dto);
    }
    updateArchived(req, dto) {
        return this.notificationService.updateArchived(req.internal_user_id, dto);
    }
};
exports.NotificationController = NotificationController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener todas las notificaciones (paginado y búsqueda)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de notificaciones paginada',
        type: Object,
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_notifications_query_dto_1.GetNotificationsQueryDto]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una notificación por ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Notificación encontrada',
        type: notification_entity_1.Notification,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Notificación no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una notificación' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Notificación creada',
        type: notification_entity_1.Notification,
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_notification_dto_1.CreateNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar una notificación' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Notificación actualizada',
        type: notification_entity_1.Notification,
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_notification_dto_1.UpdateNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una notificación (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notificación eliminada' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)('status'),
    (0, swagger_1.ApiOperation)({ summary: 'Habilitar o deshabilitar notificación' }),
    (0, swagger_1.ApiBody)({ type: update_notification_status_dto_1.UpdateNotificationStatusDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Estado de notificación actualizado',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_notification_status_dto_1.UpdateNotificationStatusDto]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Put)('seen'),
    (0, swagger_1.ApiOperation)({ summary: 'Marcar notificación como vista' }),
    (0, swagger_1.ApiBody)({ type: update_notification_seen_dto_1.UpdateNotificationSeenDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notificación marcada como vista' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_notification_seen_dto_1.UpdateNotificationSeenDto]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "updateSeen", null);
__decorate([
    (0, common_1.Put)('archive'),
    (0, swagger_1.ApiOperation)({ summary: 'Archivar notificación' }),
    (0, swagger_1.ApiBody)({ type: update_notification_archived_dto_1.UpdateNotificationArchivedDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notificación archivada' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_notification_archived_dto_1.UpdateNotificationArchivedDto]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "updateArchived", null);
exports.NotificationController = NotificationController = __decorate([
    (0, swagger_1.ApiTags)('notifications'),
    (0, common_1.Controller)('notifications'),
    (0, common_1.UseGuards)(verify_token_guard_1.VerifyTokenGuard, verify_disabled_user_guard_1.VerifyDisabledUserGuard, verify_admin_admin_guard_1.VerifyAdminAdminGuard),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], NotificationController);
//# sourceMappingURL=notification.controller.js.map