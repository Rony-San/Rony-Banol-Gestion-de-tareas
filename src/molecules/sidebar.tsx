import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { Role, UserProps } from "@/utils/enums";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation } from "@apollo/client";
import { LOGOUT_MUTATION } from "@/utils/graphql/mutations/auth";
import { Icons } from "@/components/ui/icons";

interface SidebarItemProps {
  title: string;
  url: string;
  icon: React.FC;
  role: Role;
}

interface SidebarProps {
  items: SidebarItemProps[];
  withFooter?: boolean;
}

export function AppSidebar({
  props,
  user,
}: {
  props: SidebarProps;
  user: UserProps;
}) {
  const router = useRouter();

  const filteredItems = props.items.filter(
    (item) => item.role !== Role.ADMIN || user.role === Role.ADMIN
  );

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>TaskMaster</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item: SidebarItemProps) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={router.pathname === item.url}
                    asChild>
                    <a className="bg-white shadow-sm mt-5" href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}