import {
  AirplayIcon,
  AreaChartIcon as ChartAreaIcon,
  Package,
  Calendar,
  Users,
  FileText,
  Search,
  UserCheck,
  ToggleLeft,
} from "lucide-react";
import type { NavMainType } from "@shared/types";

/**
 * Get sidebar options based on user role
 * Features implemented:
 * - Feature 1b: Role-based navigation (Admin vs Staff)
 * - Bonus: Admin/Staff mode switcher for admin users
 */
export const getSidebarOptions = (
  userRole?: string,
): { navMain: NavMainType[] } => {
  const commonItems: NavMainType[] = [
    {
      title: "Dashboard",
      url: userRole === "ADMIN" ? "/dashboard/admin" : "/dashboard/staff",
      icon: AirplayIcon,
      isActive: false,
    },
  ];

  const staffItems: NavMainType[] = [
    {
      title: "Browse Items", // Feature 3a: View available items by category
      url: "/browse",
      icon: Search,
      isActive: false,
    },
    {
      title: "My Bookings", // Feature 3b,d,e & 4f,g,h: Book items, return items, view history
      url: "/bookings",
      icon: Calendar,
      isActive: false,
    },
  ];

  const adminItems: NavMainType[] = [
    {
      title: "Inventory", // Feature 2: Inventory Management (Admin only)
      url: "/inventory",
      icon: Package,
      isActive: false,
    },
    {
      title: "Manage Bookings", // Feature 3e: Admin booking management
      url: "/admin/bookings",
      icon: UserCheck,
      isActive: false,
    },
    {
      title: "User Management", // Feature 1c: Admin manage users
      url: "/admin/users",
      icon: Users,
      isActive: false,
    },
    {
      title: "Analytics", // Feature 4a,b,c,d,e: Admin Dashboard metrics
      url: "/analytics-dashboard",
      icon: ChartAreaIcon,
      isActive: false,
    },
    {
      title: "Audit Logs", // Feature 1d & 6c: Admin view logs & audit trail
      url: "/admin/audit",
      icon: FileText,
      isActive: false,
    },
  ];

  if (userRole === "ADMIN") {
    return {
      navMain: [...commonItems, ...staffItems, ...adminItems],
    };
  } else {
    return { navMain: [...commonItems, ...staffItems] };
  }
};

// Default export for backward compatibility
export const SidebarOptions = getSidebarOptions();
