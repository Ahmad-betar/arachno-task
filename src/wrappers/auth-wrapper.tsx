"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Public routes that don't require authentication
    const publicRoutes = ["/sign-in", "/signup", "/forgot-password"];

    // Check if the current route is public
    if (publicRoutes.includes(pathname)) {
      return;
    }

    // Check for token in localStorage
    const token = localStorage.getItem("admin");

    if (!token) {
      // Redirect to signin page if no token
      router.replace("/sign-in");
    }
  }, [pathname, router]);

  return <>{children}</>;
}
