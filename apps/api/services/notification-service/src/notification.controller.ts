import { Controller, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(NotificationController.name);

  constructor(private readonly service: NotificationServiceImpl) {}

  @GrpcMethod('NotificationService', 'SendNotification')
  async sendNotification(
    request: SendNotificationRequest,
  ): Promise<NotificationResponse> {
    this.logger.log('SendNotification request:', request);
    try {
      if (
        !request.user_id ||
        !request.title ||
        !request.message ||
        !request.type
      ) {
        throw new Error('Missing required fields');
      }

      const result = await this.service.sendNotification(
        request.user_id,
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
      if (!request.user_id) {
        throw new Error('User ID is required');
      }

      const result = await this.service.getUserNotifications(request.user_id);
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
  async markAsRead(request: MarkAsReadRequest): Promise<NotificationResponse> {
    this.logger.log('MarkNotificationAsRead request:', request);
    try {
      if (!request.notification_id) {
        throw new Error('Notification ID is required');
      }

      const result = await this.service.markAsRead(request.notification_id);
      this.logger.log('MarkNotificationAsRead response:', result);
      return result;
    } catch (error) {
      this.logger.error('MarkNotificationAsRead error:', error);
      throw error;
    }
  }
}
