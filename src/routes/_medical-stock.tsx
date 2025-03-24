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

  LayoutDashboard,
  ClipboardList,
  Package,
  ShoppingCart,
  Truck,
  Wrench,
} from "lucide-react";

export const Route = createFileRoute("/_medical-stock")({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation(); // Hook pour obtenir l'URL actuelle
  const pathname = location.pathname; // Extraire le chemin de l'URL



  const navMain = [
    {
      title: "Administration",
      url: "/administration",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Articles Médicaux",
      url: "/article",
      icon: Package, // Icône représentant des boîtes de médicaments
    },
    {
      title: "Inventaire",
      url: "/inventaire",
      icon: ClipboardList, // Icône représentant une liste d'éléments
    },
    {
      title: "Commandes d'Achat",
      url: "/commande",
      icon: ShoppingCart, // Icône pour les achats et commandes
    },
    {
      title: "Approvisionnement",
      url: "/approvisionnement",
      icon: Truck, // Icône de camion pour la gestion des livraisons
    },
    {
      title: "Maintenance",
      url: "/maintenance",
      icon: Wrench, // Icône représentant les outils de réparation
    },
    {
      title: "Paramètres",
      url: "/setting-stock",
      icon: Settings2Icon, 
    },
  ];



  // Fonction pour déterminer le Breadcrumb en fonction de l'URL
  const renderBreadcrumb = () => {
    const breadcrumbs: Record<string, string> = {
      "/administration": "Administration",
      "/article": "Articles Médicaux",
      "/inventaire": "Inventaire",
      "/commande": "Commandes d'Achat",
      "/approvisionnement": "Approvisionnement",
      "/maintenance": "Maintenance",
      "/setting-stock": "Paramètres",

      "/profil-stock": "Profil",
      "/message-stock": "Messagerie",
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
