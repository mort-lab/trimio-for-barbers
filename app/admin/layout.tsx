"use client";

import * as React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { SettingsDialog } from "@/components/sidebar/settings-dialog";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settingsDialogOpen, setSettingsDialogOpen] = React.useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = React.useState("account");

  return (
    <SidebarProvider>
      <Sidebar
        onOpenSettingsDialog={() => setSettingsDialogOpen(true)}
        onChangeSettingsTab={setActiveSettingsTab}
      />
      <SidebarInset>{children}</SidebarInset>
      <SettingsDialog
        open={settingsDialogOpen}
        onOpenChange={setSettingsDialogOpen}
        activeTab={activeSettingsTab}
      />
    </SidebarProvider>
  );
}
