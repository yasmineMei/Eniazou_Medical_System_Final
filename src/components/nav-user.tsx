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
    // Consultation
    if (
      currentPath.includes("registration-opd") ||
      currentPath.includes("birth-registration") ||
      currentPath.includes("vaccin") ||
      currentPath.includes("certificate") ||
      currentPath.includes("setting-opd") ||
      currentPath.includes("profil-opd") ||
      currentPath.includes("message-opd")
    ) {
      return "Consultation";
    }

    // Hospitalisation
    if (
      currentPath.includes("registration-ipd") ||
      currentPath.includes("oT") ||
      currentPath.includes("discharge") ||
      currentPath.includes("payment") ||
      currentPath.includes("setting-ipd") ||
      currentPath.includes("profil-ipd") ||
      currentPath.includes("message-ipd")
    ) {
      return "Hospitalisation";
    }

    // Rendez-vous
    if (
      currentPath.includes("dashboard-appointment") ||
      currentPath.includes("appointment-list") ||
      currentPath.includes("doctor-leave") ||
      currentPath.includes("clini-tarif") ||
      currentPath.includes("setting-appointment") ||
      currentPath.includes("profil-appointment") ||
      currentPath.includes("message-appointment")
    ) {
      return "Rendez-vous";
    }

    // Laboratoire
    if (
      currentPath.includes("opd-request") ||
      currentPath.includes("ipd-request") ||
      currentPath.includes("report-lab")  ||
      currentPath.includes("setting-lab") ||
      currentPath.includes("profil-lab")  ||
      currentPath.includes("message-lab")
    ) {
      return "Laboratoire";
    }

    // Imagerie Médicale
    if (
      currentPath.includes("opd-radiology") ||
      currentPath.includes("ipd-radiology") ||
      currentPath.includes("report-radiology") ||
      currentPath.includes("setting-radiology") ||
      currentPath.includes("profil-radiology") ||
      currentPath.includes("message-radiology")
    ) {
      return "Imagerie Médicale";
    }

    // Infirmier
    if (
      currentPath.includes("dashboard-nurse") ||
      currentPath.includes("fiche-patient") ||
      currentPath.includes("constant") ||
      currentPath.includes("patient-medecine") ||
      currentPath.includes("report-nurse") ||
      currentPath.includes("setting-nurse") ||
      currentPath.includes("profil-nurse") ||
      currentPath.includes("message-nurse")
    ) {
      return "Infirmier";
    }

    // Patient
    if (
      currentPath.includes("patient-doctor") ||
      currentPath.includes("ordonnance") ||
      currentPath.includes("setting-doctor") ||
      currentPath.includes("profil-doctor") ||
      currentPath.includes("message-doctor")
    ) {
      return "Patient";
    }

    // Stock Médicale
    if (
      currentPath.includes("article") ||
      currentPath.includes("commande") ||
      currentPath.includes("fournisseur") ||
      currentPath.includes("setting-stock") ||
      currentPath.includes("profil-stock") ||
      currentPath.includes("message-stock")
    ) {
      return "Stock Médicale";
    }

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
        return {
          profile: "/profil-appointment",
          messages: "/message-appointment",
        };
      case "Laboratoire":
        return { profile: "/profil-lab", messages: "/message-lab" };
      case "Imagerie Médicale":
        return { profile: "/profil-radiology", messages: "/message-radiology" };
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
              <Link to="/logout" className="flex items-center">
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
