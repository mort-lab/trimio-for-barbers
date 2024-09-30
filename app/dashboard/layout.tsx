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
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import useAuthStore from "@/store/authStore";

interface Barbershop {
  id: string;
  name: string;
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
  const activeBarbershop = useAuthStore((state) => state.activeBarbershop);
  const setActiveBarbershop = useAuthStore(
    (state) => state.setActiveBarbershop
  );
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    const fetchBarbershops = async () => {
      setIsLoading(true);
      try {
        const barbershopData = await api.fetchBarbershops();
        setBarbershops(barbershopData);
        if (barbershopData.length > 0 && !activeBarbershop) {
          setActiveBarbershop(barbershopData[0]);
        }
      } catch (error) {
        console.error("Error fetching barbershops:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBarbershops();
  }, [activeBarbershop, setActiveBarbershop]);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Icons.dashboard },
    {
      name: "Appointments",
      href: "/dashboard/appointments",
      icon: Icons.appointments,
    },
    { name: "Clients", href: "/dashboard/clients", icon: Icons.clients },
    { name: "Services", href: "/dashboard/services", icon: Icons.services },
    { name: "Analytics", href: "/dashboard/analytics", icon: Icons.analytics },
    {
      name: "Barbershops",
      href: "/dashboard/barbershops",
      icon: Icons.barbershop,
    },
    { name: "Settings", href: "/dashboard/settings", icon: Icons.settings },
  ];

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  const handleCreateBarbershop = () => {
    router.push("/dashboard/barbershops");
    setOpen(false);
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr]">
      <div className="hidden border-r border-border bg-card text-card-foreground md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b border-border px-6">
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
          <ScrollArea className="flex-grow px-3">
            <div className="space-y-1 py-2">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {isLoading
                      ? "Loading..."
                      : barbershops.length > 0
                      ? activeBarbershop?.name || "Select barbershop..."
                      : "No barbershops"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search barbershop..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No barbershop found.</CommandEmpty>
                      <CommandGroup>
                        {barbershops.length > 0 ? (
                          barbershops.map((barbershop) => (
                            <CommandItem
                              key={barbershop.id}
                              value={barbershop.id}
                              onSelect={() => {
                                setActiveBarbershop(barbershop);
                                setOpen(false);
                              }}
                            >
                              {barbershop.name}
                              <Check
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  activeBarbershop?.id === barbershop.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))
                        ) : (
                          <CommandItem onSelect={handleCreateBarbershop}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create your first barbershop
                          </CommandItem>
                        )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <nav className="grid items-start gap-2 text-sm font-medium">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 transition-all hover:text-foreground hover:bg-accent",
                    pathname === item.href
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </ScrollArea>
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <Avatar className="h-10 w-10 border-2 border-primary">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    {user?.email ? user.email.charAt(0).toUpperCase() : "M"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-card"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {user?.email || "miruroz@gmail.com"}
                </p>
                <p className="text-xs text-muted-foreground">Free Plan</p>
              </div>
              <Badge
                variant="secondary"
                className="bg-primary text-primary-foreground px-2 py-1 text-xs rounded-full"
              >
                Free
              </Badge>
            </div>
            <Button
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
              variant="secondary"
              onClick={handleLogout}
            >
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
        </div>
      </div>
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
