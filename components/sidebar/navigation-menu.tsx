import * as React from "react";
import {
  Calendar,
  ChevronRight,
  DollarSign,
  ScissorsIcon,
  Settings2,
  Users,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

const navItems = [
  {
    title: "Barbershop",
    url: "/admin",
    icon: ScissorsIcon,
    isActive: true,
    items: [
      { title: "Overview", url: "/admin" },
      { title: "Analytics", url: "/admin/analytics" },
    ],
  },
  {
    title: "Appointments",
    url: "/admin/appointments",
    icon: Calendar,
    items: [
      { title: "Schedule", url: "/admin/appointments" },
      { title: "Calendar", url: "/admin/appointments/calendar" },
    ],
  },
  {
    title: "Payments",
    url: "/admin/payments",
    icon: DollarSign,
    items: [
      { title: "Manage Payments", url: "/admin/payments" },
      { title: "Pricing", url: "/admin/payments/pricing" },
    ],
  },
  {
    title: "Staff",
    url: "/admin/staff",
    icon: Users,
    items: [
      { title: "Barbers", url: "/admin/staff/barbers" },
      { title: "Schedules", url: "/admin/staff/schedules" },
    ],
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings2,
    items: [
      { title: "Barbershop", url: "/admin/settings" },
      // { title: "Account", url: "/admin/settings/account" },
    ],
  },
];

export function NavigationMenu() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Management</SidebarGroupLabel>
      <SidebarMenu>
        {navItems.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  {/* Añadimos la clase 'font-bold' para hacer el texto en negrita */}
                  <span className="font-semibold">{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <Link href={subItem.url}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
