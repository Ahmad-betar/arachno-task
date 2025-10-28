import { AppSidebar } from "@/components/ui/app-sidebar";
import Header from "@/components/ui/header";
import { SidebarProvider } from "@/components/ui/sidebar";
// import { useStore } from "@/stores/useStore";
// import { redirect } from "next/navigation";
// import { useEffect } from "react";

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  //   const user = useStore((s) => s.user);

  //   useEffect(() => {
  //     if (!user) redirect("/login");
  //   }, [user]);

  //   if (!user) return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <Header />

        <div className="p-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}
