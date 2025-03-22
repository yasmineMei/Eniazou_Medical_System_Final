import { ReactNode } from "react";
import { Navigate } from "@tanstack/react-router";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const role = localStorage.getItem("role"); // Récupérer le rôle depuis le localStorage

  if (!role || !allowedRoles.includes(role)) {
    // Rediriger vers la page de connexion si le rôle n'est pas autorisé
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
