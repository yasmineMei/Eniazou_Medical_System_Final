"use client";

import { createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  Calendar,
  Home,
  ClipboardList,
  Syringe,
  Pill,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/_nurse/dashboard-nurse")({
  component: DashboardComponent,
});

function DashboardComponent() {
  // Données simulées
  const urgentAlerts = 3;
  const todayPatients = 12;
  const completedTasks = 7;
  const pendingTasks = 5;
  const totalTasks = completedTasks + pendingTasks;
  const completionRate = Math.round((completedTasks / totalTasks) * 100);

  // Tâches en attente
  const pendingTasksList = [
    {
      id: 1,
      type: "Pansement",
      patient: "M. Dupont",
      room: "Ch. 204",
      time: "14h30",
    },
    {
      id: 2,
      type: "Prise de sang",
      patient: "Mme. Diallo",
      room: "Ch. 112",
      time: "15h15",
    },
    {
      id: 3,
      type: "Administration médicaments",
      patient: "M. Sow",
      room: "Ch. 305",
      time: "16h00",
    },
    {
      id: 4,
      type: "Contrôle tension",
      patient: "Mme. Fall",
      room: "Ch. 208",
      time: "10h00",
    },
    {
      id: 5,
      type: "Préparation intervention",
      patient: "M. Diop",
      room: "Bloc 2",
      time: "08h45",
    },
  ];

  // Alertes urgentes
  const alertsList = [
    { id: 1, type: "Tension élevée", patient: "Ch. 204", severity: "high" },
    {
      id: 2,
      type: "Allergie détectée",
      patient: "Ch. 112",
      severity: "medium",
    },
    {
      id: 3,
      type: "Médicament en rupture",
      patient: "Pharmacie",
      severity: "low",
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Tableau de Bord Infirmier</h1>
          <p className="text-muted-foreground">
            Aperçu de vos activités quotidiennes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-2">
            <Calendar className="h-4 w-4" />
            {new Date().toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </Badge>
          <Button variant="outline" size="sm">
            Voir planning complet
          </Button>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Carte Patients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Patients aujourd'hui
            </CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayPatients}</div>
            <p className="text-xs text-muted-foreground">+2 depuis hier</p>
          </CardContent>
        </Card>

        {/* Carte Alertes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Alertes urgentes
            </CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{urgentAlerts}</div>
            <div className="flex gap-1 mt-1">
              <Badge variant="destructive" className="px-1 py-0 text-xs">
                3 critiques
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Carte Tâches */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tâches</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedTasks}
              <span className="text-muted-foreground">/{totalTasks}</span>
            </div>
            <Progress value={completionRate} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {completionRate}% complétées
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grille inférieure */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Section Tâches */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Tâches en attente</CardTitle>
              <Badge variant="outline">{pendingTasks} non terminées</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3">
            {pendingTasksList.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-4 p-3 border rounded-lg"
              >
                <div
                  className={`p-2 rounded-full ${
                    task.type.includes("Pansement")
                      ? "bg-purple-100 text-purple-600"
                      : task.type.includes("sang")
                        ? "bg-red-100 text-red-600"
                        : task.type.includes("médicaments")
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {task.type.includes("Pansement") ? (
                    <Syringe className="h-4 w-4" />
                  ) : task.type.includes("sang") ? (
                    <Pill className="h-4 w-4" />
                  ) : (
                    <ClipboardList className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{task.type}</h4>
                  <p className="text-sm text-muted-foreground">
                    {task.patient} • {task.room} • {task.time}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Marquer comme fait
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Section Alertes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Alertes récentes</CardTitle>
              <Badge variant="destructive">{urgentAlerts} non lues</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3">
            {alertsList.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 p-3 border rounded-lg"
              >
                <div
                  className={`mt-1 p-2 rounded-full ${
                    alert.severity === "high"
                      ? "bg-red-100 text-red-600"
                      : alert.severity === "medium"
                        ? "bg-orange-100 text-orange-600"
                        : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{alert.type}</h4>
                  <p className="text-sm text-muted-foreground">
                    {alert.patient}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                >
                  Voir
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
