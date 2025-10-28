"use client";

import { SidebarTrigger } from "./sidebar";
import { ModeToggle } from "../mode-toggle";
import LanguageSwitcher from "../language-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { useStore } from "@/stores/useStore";
import { useRouter } from "next/navigation";

export default function Header() {
  const { profileImage, logout } = useStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className="flex justify-between p-3 bg-gray-50 dark:bg-zinc-900">
      <SidebarTrigger />

      <section className="flex items-center gap-2">
        <ModeToggle />
        <LanguageSwitcher />

        <Button
          variant="outline"
          size="icon"
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
        </Button>

        <Avatar className="h-8 w-8">
          <AvatarImage src={profileImage || undefined} />
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </section>
    </div>
  );
}
