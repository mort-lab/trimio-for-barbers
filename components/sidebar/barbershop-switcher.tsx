import * as React from "react";
import {
  AudioWaveform,
  ChevronRight,
  Command,
  GalleryVerticalEnd,
  Plus,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const barbershops = [
  {
    name: "Camavinga Barbershop",
    logo: GalleryVerticalEnd,
    plan: "Professional",
  },
  {
    name: "Trimio Corp.",
    logo: AudioWaveform,
    plan: "Ultimate",
  },
  {
    name: "Rascals Barber.",
    logo: Command,
    plan: "Free",
  },
];

export function BarbershopSwitcher() {
  const [activeBarbershop, setActiveBarbershop] = React.useState(
    barbershops[0]
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <activeBarbershop.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeBarbershop.name}
                </span>
                <span className="truncate text-xs">
                  {activeBarbershop.plan}
                </span>
              </div>
              <ChevronRight className="ml-auto rotate-90" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Barbershops
            </DropdownMenuLabel>
            {barbershops.map((barbershop, index) => (
              <DropdownMenuItem
                key={barbershop.name}
                onClick={() => setActiveBarbershop(barbershop)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <barbershop.logo className="size-4 shrink-0" />
                </div>
                {barbershop.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Add barbershop
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
