//apps/api/services/api-gateway/src/controllers/notification.controller.ts
import { CurrentUser, JwtAuthGuard } from '@microservices/common';
import { NotificationProto, UsersProto } from '@microservices/proto';
import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  OnModuleInit,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { type ClientGrpc } from '@nestjs/microservices';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SkipRateLimit } from '../throttling/rate-limit.decorator';
import { GrpcClientProxy } from '../proxies/grpc-client.proxy';
import { handleGrpcError } from '../utils/grpc-error.util';
import { CACHE_TTL, CacheGroup, CacheTTL } from 'src/caching/cache.decorator';
import { CustomCacheInterceptor } from 'src/caching/custom-cache.interceptor';

/**
 * Controller handling notification-related operations through gRPC communication
 * with the notification microservice.
 * @class NotificationController
 */
@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
@UseInterceptors(CustomCacheInterceptor)
@CacheGroup('notifications')
export class NotificationController implements OnModuleInit {
  private notificationService: NotificationProto.NotificationServiceClient;

  constructor(
    @Inject('NOTIFICATION_SERVICE') private readonly client: ClientGrpc,
    private readonly grpcClient: GrpcClientProxy,
  ) {}

  public onModuleInit(): void {
    this.notificationService =
      this.client.getService<NotificationProto.NotificationServiceClient>(
        'NotificationService',
      );
  }

  /**
   * Sends a notification to a user
   * @param {UsersProto.User} user - The authenticated user (sender)
   * @param {NotificationProto.SendNotificationRequest} sendNotificationDto - Notification data
   * @returns {Promise<NotificationProto.SendNotificationResponse>} Success response
   * @throws {NotFoundException} When user is not found
   * @throws {GrpcException} When gRPC service fails
   */
  @ApiOperation({ summary: 'Send a notification to a user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'Target user ID' },
        title: { type: 'string', description: 'Notification title' },
        message: { type: 'string', description: 'Notification message' },
        type: {
          type: 'string',
          description: 'Notification type (e.g., BOOKING_APPROVED, ITEM_DUE)',
        },
        metadata: { type: 'string', description: 'Optional JSON metadata' },
      },
      required: ['userId', 'title', 'message', 'type'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Notification sent successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'gRPC service error' })
  @UseGuards(JwtAuthGuard)
  @Post()
  public async sendNotification(
    @CurrentUser() user: UsersProto.User,
    @Body()
    sendNotificationDto: {
      userId: string;
      title: string;
      message: string;
      type: string;
      metadata?: string;
    },
  ): Promise<NotificationProto.SendNotificationResponse> {
    if (!user.id) {
      throw new NotFoundException('Unauthorized: User not found');
    }

    try {
      const request: NotificationProto.SendNotificationRequest = {
        $type: 'api.notification.SendNotificationRequest',
        userId: sendNotificationDto.userId,
        title: sendNotificationDto.title,
        message: sendNotificationDto.message,
        type: sendNotificationDto.type,
        metadata: sendNotificationDto.metadata || '',
      };

      return await this.grpcClient.call<NotificationProto.SendNotificationResponse>(
        this.notificationService.sendNotification(request),
        'Notification.sendNotification',
      );
    } catch (error) {
      handleGrpcError(error);
    }
  }

  /**
   * Retrieves all notifications for a specific user
   * @param {UsersProto.User} currentUser - The authenticated user
   * @param {string} userId - The ID of the user whose notifications to retrieve
   * @returns {Promise<NotificationProto.GetUserNotificationsResponse>} List of user's notifications
   * @throws {NotFoundException} When user is not found
   * @throws {GrpcException} When gRPC service fails
   */
  @ApiOperation({ summary: 'Get notifications for a specific user' })
  @ApiParam({ name: 'userId', type: 'string', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Notifications retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        notifications: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              message: { type: 'string' },
              type: { type: 'string' },
              read: { type: 'boolean' },
              createdAt: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'gRPC service error' })
  @UseGuards(JwtAuthGuard)
  @CacheTTL(CACHE_TTL.ONE_MINUTE) // Shorter cache for notifications
  @Get('user/:userId')
  public async getUserNotifications(
    @CurrentUser() currentUser: UsersProto.User,
    @Param('userId') userId: string,
  ): Promise<NotificationProto.GetUserNotificationsResponse> {
    if (!currentUser.id) {
      throw new NotFoundException('Unauthorized: User not found');
    }

    try {
      const request: NotificationProto.GetUserNotificationsRequest = {
        $type: 'api.notification.GetUserNotificationsRequest',
        userId: userId,
      };

      return await this.grpcClient.call<NotificationProto.GetUserNotificationsResponse>(
        this.notificationService.getUserNotifications(request),
        'Notification.getUserNotifications',
      );
    } catch (error) {
      handleGrpcError(error);
    }
  }

  /**
   * Marks a notification as read
   * @param {UsersProto.User} user - The authenticated user
   * @param {string} notificationId - The ID of the notification to mark as read
   * @returns {Promise<NotificationProto.MarkNotificationAsReadResponse>} Success response
   * @throws {NotFoundException} When user or notification is not found
   * @throws {GrpcException} When gRPC service fails
   */
  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiParam({
    name: 'notificationId',
    type: 'string',
    description: 'Notification ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Notification marked as read successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User or notification not found' })
  @ApiResponse({ status: 500, description: 'gRPC service error' })
  @UseGuards(JwtAuthGuard)
  @Patch(':notificationId/read')
  public async markNotificationAsRead(
    @CurrentUser() user: UsersProto.User,
    @Param('notificationId') notificationId: string,
  ): Promise<NotificationProto.MarkNotificationAsReadResponse> {
    if (!user.id) {
      throw new NotFoundException('Unauthorized: User not found');
    }

    try {
      const request: NotificationProto.MarkNotificationAsReadRequest = {
        $type: 'api.notification.MarkNotificationAsReadRequest',
        notificationId: notificationId,
      };

      return await this.grpcClient.call<NotificationProto.MarkNotificationAsReadResponse>(
        this.notificationService.markNotificationAsRead(request),
        'Notification.markNotificationAsRead',
      );
    } catch (error) {
      handleGrpcError(error);
    }
  }
}
