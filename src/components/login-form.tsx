import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/images/logo.png";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // État pour le rôle sélectionné
  const [error, setError] = useState(""); // État pour les messages d'erreur
  const navigate = useNavigate(); // Hook pour la navigation

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // Empêcher le rechargement de la page

    // Validation des champs
    if (!email || !password || !role) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    // Simuler une connexion et déterminer le rôle
    let authenticatedRole = "";
    if (email === "admin@example.com" && password === "admin") {
      authenticatedRole = "admin";
    } else if (email === "doctor@example.com" && password === "doctor") {
      authenticatedRole = "doctor";
    } else if (email === "nurse@example.com" && password === "nurse") {
      authenticatedRole = "nurse";
    } else if (email === "reception@example.com" && password === "reception") {
      authenticatedRole = "receptionist";
    } else {
      setError("Identifiants incorrects");
      return;
    }

    // Rediriger en fonction du rôle
    localStorage.setItem("role", authenticatedRole); // Stocker le rôle dans le localStorage
    navigate({ to: "/menu-principal" }); // Rediriger vers le menu principal
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <img
            src={logo}
            alt="Eniazou Logo"
            className="mx-auto h-40 w-auto mt-[-35px] mb-[-30px]"
          />
          <CardDescription className="text-center">
            Bienvenue à la Clinique Médicale Eniazou - Connectez pour accéder à
            la plateforme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              {/* Champ de sélection du rôle */}
              <div className="grid gap-3">
                <Label htmlFor="role">Rôle</Label>
                <Select value={role} onValueChange={(value) => setRole(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="doctor">Médecin</SelectItem>
                    <SelectItem value="nurse">Infirmier</SelectItem>
                    <SelectItem value="receptionist">Réceptionniste</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Champ email */}
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Champ mot de passe */}
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Mot de passe</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Mot de passe oublié ?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Affichage des erreurs */}
              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              {/* Bouton de soumission */}
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full bg-[#018a8cff] hover:bg-[#016a6cff]"
                >
                  Connecter
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
