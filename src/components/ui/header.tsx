"use client";

import { SidebarTrigger } from "./sidebar";
import { ModeToggle } from "../mode-toggle";
import LanguageSwitcher from "../language-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { useStore } from "@/stores/useStore";

export default function Header() {
  const { profileImage } = useStore();

  return (
    <div className="flex justify-between p-3 bg-gray-50 dark:bg-zinc-900">
      <SidebarTrigger />

      <section className="flex items-center gap-2">
        <ModeToggle />

        <LanguageSwitcher />
        
        <Avatar className="h-8 w-8">
          <AvatarImage src={profileImage || undefined} />
          <AvatarFallback>
            <User className="h-12 w-12" />
          </AvatarFallback>
        </Avatar>
      </section>
    </div>
  );
}
