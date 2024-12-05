import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/molecules/sidebar";
import { ChartCandlestick, User, Album } from "lucide-react";
import { Role, UserProps } from "@/utils/enums";
import { AdminNavbar } from "@/components/ui/tasksNavbar";

interface AdminLayoutProps {
  children: React.ReactNode;
  user: UserProps;
}

// Menu items.
const items = [
  {
    title: "Proyectos",
    url: "/admin",
    icon: Album,
    role: Role.USER,
  },

  {
    title: "Dashboard",
    url: "/admin/data",
    icon: ChartCandlestick,
    role: Role.ADMIN,
  },
  {
    title: "Usuarios",
    url: "/admin/users/users",
    icon: User,
    role: Role.ADMIN,
  },
];

const props = {
  items: items,
  withFooter: true,
};

export default function AdminLayout({ children, user }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar props={props} user={user} />
      <SidebarTrigger />

      <main className={"w-full bg-slate-100"}>
        <AdminNavbar user={user} />
        {children}
      </main>
    </SidebarProvider>
  );
}
