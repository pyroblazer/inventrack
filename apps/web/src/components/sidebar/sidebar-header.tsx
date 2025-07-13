"use client";

import { Logo } from "@shared/ui/components/logo";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@shared/ui/components/ui/sidebar";
import { NotificationCenter } from "@/components/notifications/notification-center";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Badge } from "@shared/ui/components/ui/badge";
import { ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@shared/ui/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Icons } from "@shared/ui/src/components/landing-page/icons";

/**
 * CustomSidebarHeader component renders the header content of the sidebar
 * Features implemented:
 * - Feature 5: Notifications (accessible through notification center)
 * - Bonus: Admin/Staff mode switcher
 */
export function CustomSidebarHeader() {
  const { user } = useCurrentUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentMode =
    searchParams.get("mode") || (user?.role === "ADMIN" ? "ADMIN" : "staff");

  // Bonus: Admin/Staff mode switcher - only show for ADMIN users
  const handleModeSwitch = () => {
    if (user?.role !== "ADMIN") return;

    const newMode = currentMode === "ADMIN" ? "staff" : "ADMIN";
    const dashboardUrl =
      newMode === "ADMIN" ? "/dashboard/admin" : "/dashboard/staff";
    router.push(`${dashboardUrl}?mode=${newMode}`);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Icons.Logo className="size-8" />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">InvenTrack</span>
                <span className="truncate text-xs">Equipment Management</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Feature 5: Notifications - accessible through notification center */}
              <NotificationCenter />

              {/* Bonus: Admin/Staff mode switcher - only for admin users */}
              {user?.role === "ADMIN" && (
                <div className="flex items-center gap-1">
                  <Badge
                    variant={currentMode === "ADMIN" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {currentMode === "ADMIN" ? "Admin" : "Staff"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleModeSwitch}
                    className="h-6 w-6 p-0"
                    title={`Switch to ${currentMode === "ADMIN" ? "Staff" : "Admin"} mode`}
                  >
                    {currentMode === "ADMIN" ? (
                      <ToggleRight className="h-4 w-4" />
                    ) : (
                      <ToggleLeft className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
