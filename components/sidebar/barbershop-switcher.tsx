"use client";

import * as React from "react";
import { ChevronRight, Plus, Scissors, Store } from "lucide-react";
import Link from "next/link";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchWithAuth } from "@/lib/api";
import useAuthStore from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Barbershop {
  barbershopId: string;
  barbershopName: string;
  barbershopAddress: string;
  barbershopCity: string;
  barbershopState: string;
  barbershopZipCode: string;
  barbershopLatitude: number;
  barbershopLongitude: number;
  barbershopImages: { imageUrl: string }[];
  barberProfiles: {
    userId: string;
    barberRole: string;
    barberName: string;
  }[];
}

export function BarbershopSwitcher() {
  const [barbershops, setBarbershops] = React.useState<Barbershop[]>([]);
  const [localActiveBarbershop, setLocalActiveBarbershop] =
    React.useState<Barbershop | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { setActiveBarbershop } = useAuthStore();
  const { isCollapsed } = useSidebar();

  React.useEffect(() => {
    const fetchBarbershops = async () => {
      setIsLoading(true);
      try {
        const data = await fetchWithAuth<Barbershop[]>("/barbershops");
        setBarbershops(data);
        if (data.length > 0) {
          setLocalActiveBarbershop(data[0]);
          setActiveBarbershop(data[0]);
        } else {
          setLocalActiveBarbershop(null);
          setActiveBarbershop(null);
        }
      } catch (error) {
        console.error("Failed to fetch barbershops:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBarbershops();
  }, [setActiveBarbershop]);

  const handleBarbershopChange = (barbershop: Barbershop) => {
    setLocalActiveBarbershop(barbershop);
    setActiveBarbershop(barbershop);
  };

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <div className="animate-pulse flex items-center space-x-4 w-full">
              <div className="rounded-lg bg-slate-200 h-10 w-10"></div>
              {!isCollapsed && (
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-2 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-2 bg-slate-200 rounded w-1/2"></div>
                </div>
              )}
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (barbershops.length === 0) {
    if (isCollapsed) {
      return (
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/admin/new-barbershop" passHref>
              <SidebarMenuButton size="lg" tooltip="Add Your First Barbershop">
                <Plus className="h-4 w-4" />
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      );
    }
    return (
      <Card className="w-full shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold">Welcome!</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <p className="text-sm text-muted-foreground mb-6">
            You haven't added any barbershops yet. Start by creating your first
            one!
          </p>
          <Link href="/admin/new-barbershop" passHref>
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
              Add Your First Barbershop
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground">
                <Store className="size-4" />
              </div>
              {!isCollapsed && (
                <div className="grid flex-1 text-left text-sm leading-tight ml-3">
                  <span className="truncate font-semibold">
                    {localActiveBarbershop?.barbershopName}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {localActiveBarbershop?.barbershopCity},{" "}
                    {localActiveBarbershop?.barbershopState}
                  </span>
                </div>
              )}
              {!isCollapsed && <ChevronRight className="ml-auto rotate-90" />}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1.5">
              Your Barbershops
            </DropdownMenuLabel>
            {barbershops.map((barbershop) => (
              <DropdownMenuItem
                key={barbershop.barbershopId}
                onClick={() => handleBarbershopChange(barbershop)}
                className="gap-3 px-2 py-1.5"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <Scissors className="size-4 shrink-0" />
                </div>
                <div className="flex-1 truncate">
                  {barbershop.barbershopName}
                </div>
                {localActiveBarbershop?.barbershopId ===
                  barbershop.barbershopId && (
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem asChild className="gap-3 px-2 py-1.5">
              <Link href="/admin/new-barbershop">
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">
                  Add New Barbershop
                </div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
