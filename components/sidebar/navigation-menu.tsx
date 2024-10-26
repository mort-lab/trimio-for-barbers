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

const navItems = [
  {
    title: "Barbershop",
    url: "#",
    icon: ScissorsIcon,
    isActive: true,
    items: [
      { title: "Overview", url: "#" },
      { title: "Analytics", url: "#" },
    ],
  },
  {
    title: "Appointments",
    url: "#",
    icon: Calendar,
    items: [
      { title: "Schedule", url: "#" },
      { title: "Calendar", url: "#" },
    ],
  },
  {
    title: "Services",
    url: "#",
    icon: DollarSign,
    items: [
      { title: "Manage Services", url: "#" },
      { title: "Pricing", url: "#" },
    ],
  },
  {
    title: "Staff",
    url: "#",
    icon: Users,
    items: [
      { title: "Barbers", url: "#" },
      { title: "Schedules", url: "#" },
    ],
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings2,
    items: [
      { title: "Barbershop Info", url: "#" },
      { title: "Account", url: "#" },
      { title: "Billing", url: "#" },
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
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <a href={subItem.url}>
                          <span>{subItem.title}</span>
                        </a>
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
