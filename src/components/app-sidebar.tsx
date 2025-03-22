"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { LucideIcon,} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import logo from "@/images/logo.png";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

type Item = {
  title: string;
  url: string;
  icon: LucideIcon;
};

const data = {
  user: {
    name: "Kengani Alphonse",
    email: "kenganialphonse@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

 
};

type Props = {
  items: Item[];
  sidebar?: React.ComponentProps<typeof Sidebar>;
};

export function AppSidebar({ items, sidebar }: Props) {
  return (
    <Sidebar
      collapsible="icon"
      className="bg-gradient-to-br from-[#018a8cff] to-[#016a6cff] shadow-lg"
      {...sidebar}
    >
      <SidebarHeader className="flex items-center justify-center p-4 group mt-[-25px] mb-[-35px]">
        <motion.img
          src={logo}
          alt="Eniazou Logo"
          className="h-40 w-auto transition-all duration-300 object-contain group-[.collapsed]:h-12 group-[.collapsed]:w-12 group-[.collapsed]:group-hover:h-16 group-[.collapsed]:group-hover:w-16"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={items} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
