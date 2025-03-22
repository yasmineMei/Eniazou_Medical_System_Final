"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AudioWaveform,
  BookOpen,
  ChartNoAxesCombined,
  Command,
  GalleryVerticalEnd,
  HeartHandshakeIcon,
  Settings2Icon,
  ShieldPlus,
  User2Icon,
} from "lucide-react";

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

const data = {
  user: {
    name: "Kengani Alphonse",
    email: "kenganialphonse@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Tableau de bord",
      url: "/dashboard",
      icon: ChartNoAxesCombined,
      isActive: true,
    },
    {
      title: "Patients",
      url: "/patient",
      icon: User2Icon,
    },
    {
      title: "Gestion personnel",
      url: "/personnel",
      icon: ShieldPlus,
    },
    {
      title: "Rapports",
      url: "/report",
      icon: BookOpen,
    },
    {
      title: "Services médicaux",
      url: "/service",
      icon: HeartHandshakeIcon,
    },
    {
      title: "Paramètres",
      url: "/setting",
      icon: Settings2Icon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Sidebar
      collapsible="icon"
      className="bg-gradient-to-br from-[#018a8cff] to-[#016a6cff] shadow-lg"
      {...props}
    >
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 bg-white/50 flex items-center justify-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-12 h-12 bg-[#018a8cff] rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.div>
        )}
      </AnimatePresence>
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
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
