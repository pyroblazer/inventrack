"use client";

import { ChevronsUpDown, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shared/ui/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@shared/ui/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@shared/ui/components/ui/avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { logoutUser } from "@shared/ui/actions/auth/logout-user";
import { NotificationCenter } from "@/components/notifications/notification-center";

export function SidebarFooterContent() {
  const { isMobile } = useSidebar();
  const { user } = useCurrentUser();

  const handleLogout = async () => {
    await logoutUser();
    window.location.href = "/sign-in";
  };

  if (!user) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center justify-between w-full p-2">
          {/* Feature 5a,b: Notifications - Notification center in sidebar */}
          <NotificationCenter />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    {(user.username || user.email).charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user.username || user.email}
                  </span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">
                      {(user.username || user.email).charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user.username || user.email}
                    </span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
