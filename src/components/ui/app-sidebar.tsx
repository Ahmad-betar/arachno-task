"use client";

import { Calendar, Home, Inbox, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const items = [
  {
    key: "articles",
    url: "/articles",
    icon: Home,
  },
  {
    key: "stats",
    url: "/stats",
    icon: Inbox,
  },
  {
    key: "settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const t = useTranslations("AppSidebar");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <Sidebar side={locale === "ar" ? "right" : "left"}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("groupLabel")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive =
                  pathname === `/${locale}${item.url}` ||
                  pathname.startsWith(`/${locale}${item.url}/`);

                return (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "transition-colors hover:bg-primary/10 hover:text-primary hover:font-medium",
                        isActive && "bg-primary/10 text-primary font-medium"
                      )}
                    >
                      <Link href={`/${locale}${item.url}`}>
                        <item.icon className="h-4 w-4" />
                        <span>{t(`items.${item.key}`)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
