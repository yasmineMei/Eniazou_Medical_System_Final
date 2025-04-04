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
import {
  ChartNoAxesCombined,
  User2Icon,
  Settings2Icon,
  Syringe,
  Pill,
  ClipboardSignature,
} from "lucide-react";

export const Route = createFileRoute("/_nurse")({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation(); // Hook pour obtenir l'URL actuelle
  const pathname = location.pathname; // Extraire le chemin de l'URL

  // Déclaration des éléments de navigation
  const navMain = [
    {
      title: "Tableau de bord",
      url: "/dashboard-nurse",
      icon: ChartNoAxesCombined,
      isActive: true,
    },
    {
      title: "Patient",
      url: "/fiche-patient",
      icon: User2Icon,
    },
    {
      title: "Soins & Constantes",
      url: "/constant",
      icon: Syringe,
    },
    {
      title: "Médicaments",
      url: "/patient-medecine",
      icon: Pill,
    },
    {
      title: "Rapports infirmiers",
      url: "/report-nurse",
      icon: ClipboardSignature,
    },
    {
      title: "Paramètres",
      url: "/setting-nurse",
      icon: Settings2Icon,
    },
  ];

  // Fonction pour déterminer le Breadcrumb en fonction de l'URL
  const renderBreadcrumb = () => {
    const breadcrumbs: Record<string, string> = {
      "/dashboard-nurse": "Tableau de bord",
      "/fiche-patient": "Patient",
      "/constant": "Soins & Constantes",
      "/patient-medecine": "Médicaments", 
      "/report-nurse": "Rapports quotidiens",
      "/setting-nurse": "Paramètres",

      "/profil-nurse": "Profil",
      "/message-nurse": "Messagerie",
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
