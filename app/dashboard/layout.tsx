"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  Check,
  ChevronsUpDown,
  Scissors,
  Sun,
  Moon,
  PlusCircle,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "@/components/ui/icons";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";
import { fetchWithAuth } from "@/lib/api";

interface Barbershop {
  barbershopId: string;
  barbershopName: string;
  barbershopAddress: string;
  barbershopCity: string;
  barbershopState: string;
  barbershopZipCode: string;
  barbershopLatitude: number;
  barbershopLongitude: number;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { setTheme, theme } = useTheme();

  const activeBarbershop = useAuthStore((state) => state.activeBarbershop);
  const setActiveBarbershop = useAuthStore(
    (state) => state.setActiveBarbershop
  );

  useEffect(() => {
    const fetchBarbershops = async () => {
      setIsLoading(true);
      try {
        const data = await fetchWithAuth<Barbershop[]>("/barbershops");
        setBarbershops(data);

        if (data.length > 0 && !activeBarbershop) {
          setActiveBarbershop({
            id: data[0].barbershopId,
            name: data[0].barbershopName,
            address: data[0].barbershopAddress,
          });
        }
      } catch (error) {
        console.error("Error fetching barbershops:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBarbershops();
  }, [activeBarbershop, setActiveBarbershop]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleCreateBarbershop = () => {
    router.push("/dashboard/settings");
    setOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-64 bg-card text-card-foreground border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold"
          >
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Scissors className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg">Trimio for barbers</span>
          </Link>
        </div>
        <ScrollArea className="flex-grow">
          <div className="p-4 space-y-4">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {isLoading ? (
                    <span className="text-muted-foreground">Loading...</span>
                  ) : barbershops.length > 0 ? (
                    <span className="flex items-center gap-2">
                      <Icons.barbershop className="h-4 w-4" />
                      {activeBarbershop?.name || "Select barbershop..."}
                    </span>
                  ) : (
                    "No barbershops"
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[224px] p-0">
                <Command className="w-full">
                  <CommandInput
                    placeholder="Search barbershop..."
                    className="h-9 w-full"
                  />
                  <CommandList className="w-full">
                    <CommandEmpty>No barbershop found.</CommandEmpty>
                    <CommandGroup>
                      {barbershops.length > 0 ? (
                        barbershops.map((barbershop) => (
                          <CommandItem
                            key={barbershop.barbershopId}
                            value={barbershop.barbershopId}
                            onSelect={() => {
                              setActiveBarbershop({
                                id: barbershop.barbershopId,
                                name: barbershop.barbershopName,
                                address: barbershop.barbershopAddress,
                              });
                              setOpen(false);
                            }}
                            className="w-full"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                activeBarbershop?.id === barbershop.barbershopId
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {barbershop.barbershopName}
                          </CommandItem>
                        ))
                      ) : (
                        <CommandItem
                          onSelect={handleCreateBarbershop}
                          className="w-full"
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Create your first barbershop
                        </CommandItem>
                      )}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <nav className="space-y-1">
              <Link
                href={`/dashboard/services${
                  activeBarbershop ? `?barbershopId=${activeBarbershop.id}` : ""
                }`}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 transition-all hover:text-foreground hover:bg-accent",
                  pathname === "/dashboard/services"
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground"
                )}
              >
                <Icons.barbershop className="h-4 w-4" />
                Services
              </Link>
              <Link
                href={`/dashboard/appointments${
                  activeBarbershop ? `?barbershopId=${activeBarbershop.id}` : ""
                }`}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 transition-all hover:text-foreground hover:bg-accent",
                  pathname === "/dashboard/appointments"
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground"
                )}
              >
                <Icons.appointments className="h-4 w-4" />
                Appointments
              </Link>
              <Link
                href={`/dashboard/settings${
                  activeBarbershop ? `?barbershopId=${activeBarbershop.id}` : ""
                }`}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 transition-all hover:text-foreground hover:bg-accent",
                  pathname === "/dashboard/settings"
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground"
                )}
              >
                <Icons.settings className="h-4 w-4" />
                Settings
              </Link>
            </nav>
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-10 w-10 border-2 border-primary">
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback className="bg-secondary text-secondary-foreground">
                {user?.email ? user.email.charAt(0).toUpperCase() : "M"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">{user?.email || "NO MAIL"}</p>
              <p className="text-xs text-muted-foreground">Free Plan</p>
            </div>
          </div>
          <Button
            className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
            variant="secondary"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex rounded-md bg-secondary p-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "w-full justify-start gap-2",
                theme === "light"
                  ? "bg-background text-foreground"
                  : "text-muted-foreground"
              )}
              onClick={() => setTheme("light")}
            >
              <Sun className="h-4 w-4" />
              Light
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "w-full justify-start gap-2",
                theme === "dark"
                  ? "bg-background text-foreground"
                  : "text-muted-foreground"
              )}
              onClick={() => setTheme("dark")}
            >
              <Moon className="h-4 w-4" />
              Dark
            </Button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <ScrollArea className="h-full">
          <div className="p-6">{children}</div>
        </ScrollArea>
      </main>
    </div>
  );
}
