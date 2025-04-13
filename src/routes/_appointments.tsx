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
  Calendar,
  LayoutDashboard,
  Settings,
  Stethoscope,
  Wallet,
} from "lucide-react";

export const Route = createFileRoute("/_appointments")({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation();
  const pathname = location.pathname;

  // Navigation items with more appropriate icons
  const navMain = [
    {
      title: "Rendez-vous",
      url: "/dashboard-appointment",
      icon: LayoutDashboard,
    },
    {
      title: "Liste des rendez-vous",
      url: "/appointment-list",
      icon: Calendar,
    },
    {
      title: "Congé Médical",
      url: "/doctor-leave",
      icon: Stethoscope,
    },
    {
      title: "Tarifs Clinique",
      url: "/clinic-tarif",
      icon: Wallet,
    },
    {
      title: "Paramètres",
      url: "/setting-appointment",
      icon: Settings,
    },
  ];

  // Improved breadcrumb function
  const renderBreadcrumb = () => {
    const breadcrumbMap: Record<string, { title: string; href?: string }> = {
      "/dashboard-appointment": { title: "Rendez-vous" },
      "/appointment-list": { title: "Liste des rendez-vous" },
      "/doctor-leave": { title: "Congé Médical" },
      "/clinic-tarif": { title: "Tarifs Clinique" },
      "/setting-appointment": { title: "Paramètres" },
    };

    const currentPath = breadcrumbMap[pathname] || {
      title: "Accueil",
      href: "/menu-principal",
    };

    return (
      <>
        <BreadcrumbItem>
          <BreadcrumbLink href="/menu-principal">Accueil</BreadcrumbLink>
        </BreadcrumbItem>

        {currentPath.title !== "Accueil" && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {currentPath.href ? (
                <BreadcrumbLink href={currentPath.href}>
                  {currentPath.title}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="text-[#108187]">
                  {currentPath.title}
                </BreadcrumbPage>
              )}
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
