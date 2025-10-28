"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useStore } from "@/stores/useStore";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useStore((s) => s.user);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If not logged in and not already on login, go to login
    if (!user && pathname !== "/login") {
      router.replace("/login");
    }

    // If logged in and tries to access login, redirect to articles
    if (user && pathname === "/login") {
      router.replace("/articles");
    }
  }, [user, pathname, router]);

  return <>{children}</>;
}
