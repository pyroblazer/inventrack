// apps/api/services/notification-service/src/notification.controller.ts
import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { NotificationServiceImpl } from './notification.service';

interface SendNotificationRequest {
  userId: string;
  title: string;
  message: string;
  type: string;
  metadata?: string;
}

interface GetUserNotificationsRequest {
  userId: string;
}

interface MarkNotificationAsReadRequest {
  notificationId: string;
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
    createdAt: string; // Consistent camelCase
  }>;
}

@Controller()
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name);

  constructor(private readonly service: NotificationServiceImpl) {}

  @GrpcMethod('NotificationService', 'SendNotification')
  async sendNotification(
    request: SendNotificationRequest,
  ): Promise<NotificationResponse> {
    this.logger.log('SendNotification request:', request);
    try {
      if (
        !request.userId ||
        !request.title ||
        !request.message ||
        !request.type
      ) {
        throw new Error('Missing required fields');
      }

      const result = await this.service.sendNotification(
        request.userId,
        request.title,
        request.message,
        request.type,
        request.metadata,
      );
      this.logger.log('SendNotification response:', result);
      return result;
    } catch (error) {
      this.logger.error('SendNotification error:', error);
      throw error;
    }
  }

  @GrpcMethod('NotificationService', 'GetUserNotifications')
  async getUserNotifications(
    request: GetUserNotificationsRequest,
  ): Promise<UserNotificationsResponse> {
    this.logger.log('GetUserNotifications request:', request);
    try {
      if (!request.userId) {
        throw new Error('User ID is required');
      }

      const result = await this.service.getUserNotifications(request.userId);
      this.logger.log(
        'GetUserNotifications response count:',
        result.notifications.length,
      );
      return result;
    } catch (error) {
      this.logger.error('GetUserNotifications error:', error);
      throw error;
    }
  }

  @GrpcMethod('NotificationService', 'MarkNotificationAsRead')
  async markNotificationAsRead(
    request: MarkNotificationAsReadRequest,
  ): Promise<NotificationResponse> {
    this.logger.log('MarkNotificationAsRead request:', request);
    try {
      if (!request.notificationId) {
        throw new Error('Notification ID is required');
      }

      const result = await this.service.markAsRead(request.notificationId);
      this.logger.log('MarkNotificationAsRead response:', result);
      return result;
    } catch (error) {
      this.logger.error('MarkNotificationAsRead error:', error);
      throw error;
    }
  }
}
