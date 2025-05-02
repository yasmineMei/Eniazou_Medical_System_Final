"use client";

import {
  BadgeCheck,
  ChevronsUpDown,
  LogOut,
  MessageCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, useRouter } from "@tanstack/react-router";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const currentPath = router.state.location.pathname;

  // Détermine le module actif en fonction du chemin courant
  const getActiveModule = () => {
    if (currentPath.includes("registration-opd")) return "Consultation";
    if (currentPath.includes("registration-ipd")) return "Hospitalisation";
    if (currentPath.includes("dashboard-appointment")) return "Rendez-vous";
    if (currentPath.includes("opd-request")) return "Laboratoire";
    if (currentPath.includes("opd-radiology")) return "Imagerie Médicale";
    if (currentPath.includes("dashboard-nurse")) return "Infirmier";
    if (currentPath.includes("patient-doctor")) return "Patient";
    if (currentPath.includes("article")) return "Stock Médicale";
    if (currentPath.includes("dashboard")) return "Administrateur";
    return null;
  };

  const activeModule = getActiveModule();

  // Retourne les URLs de profil et messagerie en fonction du module actif
  const getModuleUrls = () => {
    switch (activeModule) {
      case "Consultation":
        return { profile: "/profil-opd", messages: "/message-opd" };
      case "Hospitalisation":
        return { profile: "/profil-ipd", messages: "/message-ipd" };
      case "Rendez-vous":
        return { profile: "/profil-rdv", messages: "/message-rdv" };
      case "Laboratoire":
        return { profile: "/profil-lab", messages: "/message-lab" };
      case "Imagerie Médicale":
        return { profile: "/profil-rad", messages: "/message-rad" };
      case "Infirmier":
        return { profile: "/profil-nurse", messages: "/message-nurse" };
      case "Patient":
        return { profile: "/profil-doctor", messages: "/message-doctor" };
      case "Stock Médicale":
        return { profile: "/profil-stock", messages: "/message-stock" };
      default:
        return { profile: "/profil", messages: "/message" };
    }
  };

  const { profile, messages } = getModuleUrls();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  to={profile}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <BadgeCheck className="size-4" />
                  Profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to={messages}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="size-4" />
                  Messagerie
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <Link to="/" className="flex items-center">
                <LogOut className="mr-2 size-4" />
                Déconnexion
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
