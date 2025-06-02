//apps/web/src/actions/notification/server-actions.ts
"use server";

import { NotificationService } from "@/actions/notification/notification-service";
import { type NotificationEndpoints } from "@shared/types";

/**
 * Sends a notification
 */
export async function sendNotification(
  request: Readonly<NotificationEndpoints["sendNotification"]["body"]>,
): Promise<NotificationEndpoints["sendNotification"]["response"]> {
  return NotificationService.sendNotification(request);
}

/**
 * Fetches notifications for the current user
 */
export async function getUserNotifications(
  userId: string,
): Promise<NotificationEndpoints["getUserNotifications"]["response"]> {
  return NotificationService.getUserNotifications(userId);
}

/**
 * Marks a notification as read
 */
export async function markNotificationAsRead(
  notificationId: string,
): Promise<NotificationEndpoints["markNotificationAsRead"]["response"]> {
  return NotificationService.markNotificationAsRead(notificationId);
}
