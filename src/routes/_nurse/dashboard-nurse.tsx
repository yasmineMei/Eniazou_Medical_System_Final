import { createFileRoute } from "@tanstack/react-router";
import { Bell, Calendar, Home } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_nurse/dashboard-nurse")({
  component: DashboardComponent,
});

function DashboardComponent() {
  // Données simulées
  const urgentAlerts = 3;
  const todayPatients = 12;
  const pendingTasks = 5;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tableau de Bord Infirmier</h1>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-2">
            <Calendar className="h-4 w-4" />
            {new Date().toLocaleDateString("fr-FR")}
          </Badge>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Carte Accueil */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Home className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Patients aujourd'hui</h3>
              <p className="text-2xl font-bold">{todayPatients}</p>
            </div>
          </div>
        </div>

        {/* Carte Alertes */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-destructive/10 p-3">
              <Bell className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">Alertes urgentes</h3>
                {urgentAlerts > 0 && (
                  <Badge variant="destructive">{urgentAlerts}</Badge>
                )}
              </div>
              <p className="text-2xl font-bold">{urgentAlerts}</p>
            </div>
          </div>
        </div>

        {/* Carte Planning */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-500/10 p-3">
              <Calendar className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h3 className="font-medium">Prochaine garde</h3>
              <p className="text-2xl font-bold">Demain 20h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Tâches */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Tâches en attente</h2>
          <Badge variant="outline">{pendingTasks} non terminées</Badge>
        </div>

        <div className="space-y-4">
          {Array.from({ length: pendingTasks }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded border p-4"
            >
              <div>
                <h4 className="font-medium">Pansement - Ch. 204</h4>
                <p className="text-sm text-muted-foreground">
                  M. Dupont - 14h30
                </p>
              </div>
              <Badge variant="secondary">À faire</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
