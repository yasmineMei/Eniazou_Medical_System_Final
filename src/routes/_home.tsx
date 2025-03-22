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
  ShieldPlus,
  BookOpen,
  HeartHandshakeIcon,
  Settings2Icon,
} from "lucide-react";

export const Route = createFileRoute("/_home")({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation(); // Hook pour obtenir l'URL actuelle
  const pathname = location.pathname; // Extraire le chemin de l'URL

  // Déclaration des éléments de navigation
  const navMain = [
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
  ];

  // Fonction pour déterminer le Breadcrumb en fonction de l'URL
  const renderBreadcrumb = () => {
    const breadcrumbs: Record<string, string> = {
      "/dashboard": "Tableau de bord",
      "/patient": "Patients",
      "/personnel": "Gestion du Personnel",
      "/report": "Rapports",
      "/service": "Services médicaux",
      "/setting": "Paramètres",
      "/profil": "Profil",
      "/message": "Messagerie",
    };

    const currentTitle = breadcrumbs[pathname] || "Accueil";

    return (
      <>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
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
