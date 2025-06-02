"use client";

import type * as React from "react";
import { getSidebarOptions } from "@/config/sidebar-config";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@shared/ui/components/ui/sidebar";
import { CustomSidebarHeader } from "./sidebar-header";
import { SidebarMainContent } from "./sidebar-main-content";
import { SidebarFooterContent } from "./sidebar-footer-content";
import type { NavMainType } from "@shared/types";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useCurrentUser();
  // console.log("current user app sidebar", user);
  const sidebarOptions: { navMain: NavMainType[] } = getSidebarOptions(
    user?.role,
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <CustomSidebarHeader />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMainContent items={sidebarOptions.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarFooterContent />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
