// apps/api/services/notification-service/src/notification.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { RedisService } from '@microservices/redis';
import {
  eq,
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
  created_at: string;
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
      created_at: inserted.createdAt.toISOString(),
    };

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
      .where(eq(notifications.userId, userId));

    const protoNotifications: ProtoNotification[] = rows.map((row) => {
      if (typeof row.content !== 'object' || row.content === null) {
        throw new Error('Invalid notification content');
      }

      if (row.read === null) {
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
        read: row.read, // Now guaranteed to be boolean
        created_at: row.createdAt.toISOString(), // Now guaranteed to exist
      };
    });

    return { notifications: protoNotifications };
  }

  async markAsRead(notificationId: string): Promise<{ success: boolean }> {
    const result = await this.database
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, notificationId));

    if (!result) {
      throw new Error('Failed to update notification');
    }

    return { success: true };
  }
}
