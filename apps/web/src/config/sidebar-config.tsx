import {
  AirplayIcon,
  AreaChartIcon as ChartAreaIcon,
  Package,
  Calendar,
  Users,
  FileText,
} from "lucide-react";
import type { NavMainType } from "@shared/types";

/**
 * Get sidebar options based on user role
 */
export const getSidebarOptions = (
  userRole?: string,
): { navMain: NavMainType[] } => {
  const commonItems: NavMainType[] = [
    {
      title: "Dashboard",
      url: userRole === "admin" ? "/dashboard/admin" : "/dashboard/staff",
      icon: AirplayIcon,
      isActive: false,
    },
  ];

  const staffItems: NavMainType[] = [
    {
      title: "Browse Items",
      url: "/browse",
      icon: Package,
      isActive: false,
    },
    {
      title: "My Bookings",
      url: "/bookings",
      icon: Calendar,
      isActive: false,
    },
    {
      title: "Calendar View",
      url: "/bookings/calendar",
      icon: Calendar,
      isActive: false,
    },
  ];

  const adminItems: NavMainType[] = [
    {
      title: "Inventory",
      url: "/inventory",
      icon: Package,
      isActive: false,
    },
    {
      title: "Manage Bookings",
      url: "/admin/bookings",
      icon: Calendar,
      isActive: false,
    },
    {
      title: "User Management",
      url: "/admin/users",
      icon: Users,
      isActive: false,
    },
    {
      title: "Analytics",
      url: "/analytics-dashboard",
      icon: ChartAreaIcon,
      isActive: false,
    },
    {
      title: "Audit Logs",
      url: "/admin/audit",
      icon: FileText,
      isActive: false,
    },
  ];

  if (userRole === "admin") {
    return { navMain: [...commonItems, ...staffItems, ...adminItems] };
  } else {
    return { navMain: [...commonItems, ...staffItems] };
  }
};

// Default export for backward compatibility
export const SidebarOptions = getSidebarOptions();
