// packages/types/src/api-client/notification-endpoints.ts
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationEndpoints {
  sendNotification: {
    body: {
      userId: string;
      title: string;
      message: string;
      type: string;
      metadata?: string;
    };
    response: {
      success: boolean;
    };
  };
  getUserNotifications: {
    response: {
      notifications: Notification[];
    };
  };
  markNotificationAsRead: {
    response: {
      success: boolean;
    };
  };
}
