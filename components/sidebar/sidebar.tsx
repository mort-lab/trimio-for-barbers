import * as React from "react";
import {
  Sidebar as SidebarComponent,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { BarbershopSwitcher } from "./barbershop-switcher";
import { NavigationMenu } from "./navigation-menu";
// import { ProjectsMenu } from "./projects-menu";
import { UserProfile } from "./user-profile";

interface SidebarProps {
  onOpenSettingsDialog: () => void;
  onChangeSettingsTab: (tab: string) => void;
}

export function Sidebar({
  onOpenSettingsDialog,
  onChangeSettingsTab,
}: SidebarProps) {
  return (
    <SidebarComponent collapsible="icon">
      <SidebarHeader>
        <BarbershopSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavigationMenu />
        {/* <ProjectsMenu /> */}
      </SidebarContent>
      <SidebarFooter>
        <UserProfile
          onOpenSettingsDialog={onOpenSettingsDialog}
          onChangeSettingsTab={onChangeSettingsTab}
        />
      </SidebarFooter>
      <SidebarRail />
    </SidebarComponent>
  );
}
