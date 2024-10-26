"use client";

import * as React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/sidebar/sidebar";
import { SettingsDialog } from "@/components/sidebar/settings-dialog";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { accessToken, user } = useAuthStore();
  const router = useRouter();

  const [settingsDialogOpen, setSettingsDialogOpen] = React.useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = React.useState("account");

  React.useEffect(() => {
    if (!accessToken || !user) {
      router.push("/login"); // Si no hay token, redirige al login
    }
  }, [accessToken, user, router]);

  if (!accessToken || !user) {
    return <div>Loading...</div>; // Muestra un loader mientras se redirige
  }

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
