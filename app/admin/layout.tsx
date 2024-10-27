"use client";

import * as React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/sidebar/sidebar";
import { SettingsDialog } from "@/components/sidebar/settings-dialog";
import useAuthStore from "@/store/authStore";
import { useRouter, usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumb";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { accessToken, user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const [settingsDialogOpen, setSettingsDialogOpen] = React.useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = React.useState("account");

  React.useEffect(() => {
    if (!accessToken || !user) {
      router.push("/login");
    }
  }, [accessToken, user, router]);

  if (!accessToken || !user) {
    return <div>Loading...</div>;
  }

  const isNewBarbershopPage = pathname === "/admin/new-barbershop";

  if (isNewBarbershopPage) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <Sidebar
        onOpenSettingsDialog={() => setSettingsDialogOpen(true)}
        onChangeSettingsTab={setActiveSettingsTab}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DynamicBreadcrumb />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
      <SettingsDialog
        open={settingsDialogOpen}
        onOpenChange={setSettingsDialogOpen}
        activeTab={activeSettingsTab}
      />
    </SidebarProvider>
  );
}
