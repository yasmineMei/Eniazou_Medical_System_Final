/**
 * Le module Médecin est remplacer par le module Patient
 * Patient comporte la liste des patients de la clinique avec leur informations médicaux
 * ce module permet aussi la création des ordonnances et prescriptions des patients et de la imprimer  */

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { Settings2Icon, Pill, Users } from "lucide-react";

export const Route = createFileRoute("/_doctor")({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation(); // Hook pour obtenir l'URL actuelle
  const pathname = location.pathname; // Extraire le chemin de l'URL

  // Déclaration des éléments de navigation
  const navMain = [
    {
      title: "Mes patients",
      url: "/patient-doctor",
      icon: Users,
      isActive: true,
    },
    {
      title: "Prescriptions & Ordonnances",
      url: "/ordonnance",
      icon: Pill,
    },
    {
      title: "Paramètres",
      url: "/setting-doctor",
      icon: Settings2Icon,
    },
  ];

  // Fonction pour déterminer le Breadcrumb en fonction de l'URL
  const renderBreadcrumb = () => {
    const breadcrumbs: Record<string, string> = {
      "/patient-doctor": "Mes patients",
      "/patient-doctor/$patientId": "Patients",
      "/create-record": "Patients",
      "/ordonnance": "Prescriptions & Ordonnances",
      "/setting-doctor": "Paramètres",

      "/profil-doctor": "Profil",
      "/message-doctor": "Messagerie",
    };

    const currentTitle = breadcrumbs[pathname] || "Accueil";

    return (
      <>
        <BreadcrumbItem>
          <BreadcrumbLink href="/menu-principal">Accueil</BreadcrumbLink>
        </BreadcrumbItem>
        {currentTitle !== "Accueil" && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-[#108187]">
                {currentTitle}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </>
    );
  };

  return (
    <SidebarProvider>
      <AppSidebar items={navMain} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>{renderBreadcrumb()}</BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
