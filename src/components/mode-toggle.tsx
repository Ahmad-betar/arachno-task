"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";

export function ModeToggle() {
  const t = useTranslations("ModeToggle");
  const locale = useLocale();
  const { setTheme } = useTheme();

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Sun
              className={cn(
                "h-[1.2rem] w-[1.2rem] transition-all",
                locale === "ar" ? "ml-1" : "mr-1",
                "scale-100 rotate-0 dark:scale-0 dark:-rotate-90"
              )}
            />
            <Moon
              className={cn(
                "absolute h-[1.2rem] w-[1.2rem] transition-all",
                locale === "ar" ? "mr-1" : "ml-1",
                "scale-0 rotate-90 dark:scale-100 dark:rotate-0"
              )}
            />
            <span className="sr-only">{t("toggle")}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            {t("light")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            {t("dark")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
