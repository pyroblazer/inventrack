"use client";

import { useEffect, useState } from "react";
import {
  getUserNotifications,
  markNotificationAsRead,
} from "@/actions/notification/server-actions";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@shared/ui/components/ui/popover";
import { Button } from "@shared/ui/components/ui/button";
import { Badge } from "@shared/ui/components/ui/badge";
import { Bell, Check, X } from "lucide-react";
import { toast } from "sonner";
import type { Notification } from "@shared/types";
import { format } from "date-fns";
import { ScrollArea } from "@shared/ui/components/ui/scroll-area";

/**
 * NotificationCenter component - Social media style notification dropdown
 * Features implemented:
 * - Feature 5a: Staff notified when booking is approved or item is due
 * - Feature 5b: Admin notified when items are returned or overdue
 * - Social media style dropdown with read/unread status
 * - Mark as read functionality
 * - Real-time notification count
 */
export function NotificationCenter() {
  const { user } = useCurrentUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      loadNotifications();
    }
  }, [user, isOpen]);

  // Auto-refresh notifications every 30 seconds when open
  useEffect(() => {
    if (!isOpen || !user) return;

    const interval = setInterval(() => {
      loadNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [isOpen, user]);

  const loadNotifications = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await getUserNotifications(user.id);
      setNotifications(response.notifications || []);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Feature 5: Mark notification as read (like social media)
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
      );
    } catch (error) {
      toast.error("Failed to mark notification as read");
      console.error(error);
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter((n) => !n.read);

    try {
      await Promise.all(
        unreadNotifications.map((n) => markNotificationAsRead(n.id)),
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all notifications as read");
      console.error(error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Feature 5a,5b: Different notification types with appropriate icons
  const getNotificationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "booking_approved":
        return "✅"; // Feature 5a: Staff notified when booking is approved
      case "booking_rejected":
        return "❌"; // Feature 5a: Staff notified when booking is rejected
      case "item_due":
        return "⏰"; // Feature 5a: Staff notified when item is due
      case "item_overdue":
        return "🚨"; // Feature 5b: Admin notified when items are overdue
      case "item_returned":
        return "📦"; // Feature 5b: Admin notified when items are returned
      case "booking_request":
        return "📋"; // Feature 5b: Admin notified of new booking requests
      default:
        return "📢";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "booking_approved":
        return "text-green-600";
      case "booking_rejected":
        return "text-red-600";
      case "item_due":
      case "item_overdue":
        return "text-yellow-600";
      case "item_returned":
        return "text-blue-600";
      case "booking_request":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {/* Feature 5: Real-time notification count badge */}
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        {/* Header */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <p className="text-sm text-muted-foreground">
                  {unreadCount} unread notification
                  {unreadCount !== 1 ? "s" : ""}
                </p>
              )}
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-xs"
              >
                Mark all read
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <ScrollArea className="max-h-96">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                    !notification.read
                      ? "bg-blue-50 border-l-4 border-l-blue-500"
                      : ""
                  }`}
                  onClick={() =>
                    !notification.read && handleMarkAsRead(notification.id)
                  }
                >
                  <div className="flex items-start gap-3">
                    <div className="text-lg flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          className={`text-sm font-medium ${getNotificationColor(notification.type)} ${
                            !notification.read ? "font-semibold" : ""
                          }`}
                        >
                          {notification.title}
                        </h4>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:opacity-100"
                          >
                            {notification.read ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : (
                              <X className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(
                          new Date(notification.createdAt),
                          "MMM dd, HH:mm",
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs"
              onClick={() => {
                // Navigate to notifications page (if exists)
                setIsOpen(false);
              }}
            >
              View all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
