"use client";

import { type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[#108187]">
        Gestion Clinique
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuButton
            key={item.title} // Utilisez `name` comme clé
            tooltip={item.title} // Affichez `name` comme tooltip
            asChild
          >
            <a href={item.url} className="flex items-center gap-2">
              {item.icon && <item.icon className="h-4 w-4 " />}{" "}
              {/* Affichez l'icône */}
              <span>{item.title}</span> {/* Affichez le nom */}
            </a>
          </SidebarMenuButton>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
