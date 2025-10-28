"use client";
import { useStore } from "@/stores/useStore";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

export function TopBar() {
  const { isDark, toggleTheme, locale, setLocale } = useStore();
  const router = useRouter();
  const currentLocale = useLocale();

  const switchLocale = () => {
    const newLocale = currentLocale === "en" ? "ar" : "en";
    setLocale(newLocale);
    router.refresh();
  };

  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {isDark ? <Sun /> : <Moon />}
        </Button>
        <Button variant="ghost" size="icon" onClick={switchLocale}>
          <Globe />
        </Button>
      </div>
      <div className="w-10 h-10 bg-gray-300 rounded-full" />
    </div>
  );
}
