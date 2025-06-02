// apps/api/services/notification-service/src/notification.controller.ts
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { NotificationServiceImpl } from './notification.service';

interface SendNotificationRequest {
  user_id: string;
  title: string;
  message: string;
  type: string;
  metadata?: string;
}

interface GetUserNotificationsRequest {
  user_id: string;
}

interface MarkAsReadRequest {
  notification_id: string;
}

interface NotificationResponse {
  success: boolean;
}

interface UserNotificationsResponse {
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    type: string;
    read: boolean;
    created_at: string;
  }>;
}

@Controller()
export class NotificationController {
  constructor(private readonly service: NotificationServiceImpl) {}

  @GrpcMethod('NotificationService', 'SendNotification')
  async sendNotification(
    request: SendNotificationRequest,
  ): Promise<NotificationResponse> {
    if (
      !request.user_id ||
      !request.title ||
      !request.message ||
      !request.type
    ) {
      throw new Error('Missing required fields');
    }

    return this.service.sendNotification(
      request.user_id,
      request.title,
      request.message,
      request.type,
      request.metadata,
    );
  }

  @GrpcMethod('NotificationService', 'GetUserNotifications')
  async getUserNotifications(
    request: GetUserNotificationsRequest,
  ): Promise<UserNotificationsResponse> {
    if (!request.user_id) {
      throw new Error('User ID is required');
    }

    return this.service.getUserNotifications(request.user_id);
  }

  @GrpcMethod('NotificationService', 'MarkNotificationAsRead')
  async markAsRead(request: MarkAsReadRequest): Promise<NotificationResponse> {
    if (!request.notification_id) {
      throw new Error('Notification ID is required');
    }

    return this.service.markAsRead(request.notification_id);
  }
}
