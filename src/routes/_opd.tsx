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
  Settings2Icon,
  ClipboardList,
  FileText,
  HeartPulse,
  Microscope,
  Baby,
  SyringeIcon,
} from "lucide-react";

export const Route = createFileRoute("/_opd")({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation(); // Hook pour obtenir l'URL actuelle
  const pathname = location.pathname; // Extraire le chemin de l'URL

  // Déclaration des éléments de navigation
  const navMain = [
    {
      title: "Consultation",
      url: "/registration-opd",
      icon: ClipboardList,
      isActive: true,
    },
    {
      title: "Examens médicaux",
      url: "/investigation-opd",
      icon: Microscope,
    },
    {
      title: "Soins ambulatoires",
      url: "/dayCare",
      icon: HeartPulse,
    },
    {
      title: "Naissances",
      url: "/birth-registration",
      icon: Baby,
    },
    {
      title: "Vaccination",
      url: "/vaccin",
      icon: SyringeIcon,
    },
    {
      title: "Certificats",
      url: "/certificate",
      icon: FileText,
    },
    {
      title: "Paramètres",
      url: "/setting-opd",
      icon: Settings2Icon,
    },
  ];

  // Fonction pour déterminer le Breadcrumb en fonction de l'URL
  const renderBreadcrumb = () => {
    const breadcrumbs: Record<string, string> = {
      "/registration-opd": "Consultation",
      "/investigation-opd": "Examens médicaux ",
      "/dayCare": "Soins ambulatoires",
      "/birth-registration": "Naissances ",
      "/vaccin": "Vaccination",
      "/certificate": "Certificats",
      "/setting-opd": "Paramètres",
      
      "/profil-opd": "Profil",
      "/message-opd": "Messagerie",
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
