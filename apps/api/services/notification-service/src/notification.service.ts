// apps/api/services/notification-service/src/notification.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { RedisService } from '@microservices/redis';
import {
  eq,
  desc,
  type NeonDatabaseType,
  notifications,
} from '@microservices/database';

interface NotificationContent {
  title: string;
  message: string;
  metadata: string | null;
}

interface ProtoNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string; // Consistent camelCase
}

@Injectable()
export class NotificationServiceImpl {
  constructor(
    @Inject('DATABASE_CONNECTION')
    private readonly database: NeonDatabaseType,
    private readonly redis: RedisService,
  ) {}

  async sendNotification(
    userId: string,
    title: string,
    message: string,
    type: string,
    metadata?: string,
  ): Promise<{ success: boolean }> {
    const newNotif = {
      userId,
      type,
      content: {
        title,
        message,
        metadata: metadata ?? null,
      } satisfies NotificationContent,
      status: 'sent',
      read: false,
      createdAt: new Date(),
    };

    const [inserted] = await this.database
      .insert(notifications)
      .values(newNotif)
      .returning();

    if (!inserted) {
      throw new Error('Failed to create notification');
    }

    if (!inserted.createdAt) {
      throw new Error('Notification created without timestamp');
    }

    const protoNotification: ProtoNotification = {
      id: inserted.id.toString(),
      title,
      message,
      type,
      read: false,
      createdAt: inserted.createdAt.toISOString(), // Consistent camelCase
    };

    // Publish to Redis for real-time notifications
    await this.redis
      .getClient()
      .publish(`notifications:${userId}`, JSON.stringify(protoNotification));

    return { success: true };
  }

  async getUserNotifications(
    userId: string,
  ): Promise<{ notifications: ProtoNotification[] }> {
    const rows = await this.database
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt)); // Order by newest first

    const protoNotifications: ProtoNotification[] = rows.map((row) => {
      if (typeof row.content !== 'object' || row.content === null) {
        throw new Error('Invalid notification content');
      }

      if (row.read === null || row.read === undefined) {
        throw new Error('Notification read status is null');
      }

      if (!row.createdAt) {
        throw new Error('Notification missing createdAt timestamp');
      }

      const content = row.content as NotificationContent;
      return {
        id: row.id.toString(),
        title: content.title,
        message: content.message,
        type: row.type,
        read: row.read,
        createdAt: row.createdAt.toISOString(), // Consistent camelCase
      };
    });

    return { notifications: protoNotifications };
  }

  async markAsRead(notificationId: string): Promise<{ success: boolean }> {
    const [result] = await this.database
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, notificationId))
      .returning({ id: notifications.id });

    if (!result) {
      throw new Error('Notification not found or failed to update');
    }

    return { success: true };
  }
}
