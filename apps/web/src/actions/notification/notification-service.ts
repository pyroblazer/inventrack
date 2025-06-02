//apps/web/src/actions/notification/notification-service.ts
import { ApiClient } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/get-error-message";
import { type NotificationEndpoints } from "@shared/types";

/**
 * Service class for notification-related API calls
 */
export class NotificationService {
  private static readonly BASE_PATH = "/notifications";

  /**
   * Sends a notification to a user
   */
  static async sendNotification(
    request: Readonly<NotificationEndpoints["sendNotification"]["body"]>,
  ): Promise<NotificationEndpoints["sendNotification"]["response"]> {
    try {
      const response = await ApiClient.post<
        NotificationEndpoints["sendNotification"]["body"],
        NotificationEndpoints["sendNotification"]["response"]
      >(`${this.BASE_PATH}`, {
        body: request,
      });

      if (!response.success) {
        throw new Error("Failed to send notification");
      }

      return response.data;
    } catch (error) {
      console.error("Failed to send notification:", error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Fetches notifications for the current user
   */
  static async getUserNotifications(
    userId: string,
  ): Promise<NotificationEndpoints["getUserNotifications"]["response"]> {
    try {
      const response = await ApiClient.get<
        NotificationEndpoints["getUserNotifications"]["response"]
      >(`${this.BASE_PATH}/user/${userId}`);

      if (!response.success) {
        throw new Error("Failed to fetch user notifications");
      }

      return response.data;
    } catch (error) {
      console.error(`Failed to fetch notifications for user ${userId}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Marks a notification as read
   */
  static async markNotificationAsRead(
    notificationId: string,
  ): Promise<NotificationEndpoints["markNotificationAsRead"]["response"]> {
    try {
      const response = await ApiClient.patch<
        undefined,
        NotificationEndpoints["markNotificationAsRead"]["response"]
      >(`${this.BASE_PATH}/${notificationId}/read`);

      if (!response.success) {
        throw new Error("Failed to mark notification as read");
      }

      return response.data;
    } catch (error) {
      console.error(
        `Failed to mark notification ${notificationId} as read:`,
        error,
      );
      throw new Error(getErrorMessage(error));
    }
  }
}
