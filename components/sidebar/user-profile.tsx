"use client";

import * as React from "react";
import {
  BadgeCheck,
  Bell,
  ChevronRight,
  CreditCard,
  LogOut,
  Sparkles,
  Globe,
  Moon,
  Sun,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

interface UserProfileProps {
  onOpenSettingsDialog: () => void;
  onChangeSettingsTab: (tab: string) => void;
}

const languages = [
  { code: "es", name: "Español" },
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
];

export const UserProfile = React.memo(function UserProfile({
  onOpenSettingsDialog,
  onChangeSettingsTab,
}: UserProfileProps) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = React.useState(languages[0]);
  const { theme, setTheme } = useTheme();

  const handleLogout = React.useCallback(() => {
    logout();
    router.push("/login");
  }, [logout, router]);

  const handleLanguageChange = React.useCallback(
    (language: (typeof languages)[0]) => {
      setSelectedLanguage(language);
      // Here you would typically call a function to change the app's language
      // For example: changeAppLanguage(language.code);
    },
    []
  );

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme, setTheme]);

  if (!user) {
    return null; // or a loading state
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
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src="/shadcn.jpg" alt={user.email} />
                <AvatarFallback className="rounded-lg">
                  {user.email.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.email}</span>
                <span className="truncate text-xs">{user.role}</span>
              </div>
              <ChevronRight className="ml-auto rotate-90" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={4}
          >
            <div className="flex items-center gap-2 p-2">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src="/shadcn.jpg" alt={user.email} />
                <AvatarFallback className="rounded-lg">
                  {user.email.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="font-semibold">{user.email}</span>
                <span className="text-xs text-muted-foreground">
                  {user.role}
                </span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Sparkles className="mr-2 h-4 w-4" />
              <span>Upgrade to Pro</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="bg-primary/5 text-primary"
              onClick={() => {
                onOpenSettingsDialog();
                onChangeSettingsTab("account");
              }}
            >
              <BadgeCheck className="mr-2 h-4 w-4" />
              <span>Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                onOpenSettingsDialog();
                onChangeSettingsTab("billing");
              }}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                onOpenSettingsDialog();
                onChangeSettingsTab("notifications");
              }}
            >
              <Bell className="mr-2 h-4 w-4" />
              <span>Notifications</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Globe className="mr-2 h-4 w-4" />
                <span>Language</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang)}
                  >
                    <span>{lang.name}</span>
                    {lang.code === selectedLanguage.code && (
                      <BadgeCheck className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem onClick={toggleTheme}>
              {theme === "light" ? (
                <Moon className="mr-2 h-4 w-4" />
              ) : (
                <Sun className="mr-2 h-4 w-4" />
              )}
              <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
});
