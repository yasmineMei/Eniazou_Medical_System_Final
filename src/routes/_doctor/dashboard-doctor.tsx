/**Vue d'ensemble du planning de la journée (rendez-vous, consultations en cours, urgences)

Notifications et rappels (alertes de rendez-vous à venir, résultats d'examens disponibles, messages du personnel ou des patients)

*/
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarClock,
  Stethoscope,
  User,
  AlertTriangle,
  Bell,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_doctor/dashboard-doctor")({
  component: RouteComponent,
});

function RouteComponent() {
  // Données fictives pour la démo
  const todayAppointments = [
    { id: 1, patient: "Jean Dupont", time: "09:30", status: "confirmé" },
    { id: 2, patient: "Marie Martin", time: "11:15", status: "en attente" },
    { id: 3, patient: "Paul Durand", time: "14:00", status: "confirmé" },
  ];

  const notifications = [
    {
      id: 1,
      message: "Résultats d'analyse disponibles pour Sophie L.",
      type: "results",
    },
    { id: 2, message: "Urgence - Patient en salle 3", type: "emergency" },
  ];

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="text-3xl font-bold text-[#018a8cff]">
        Tableau de bord médical
      </h1>

      {/* Cartes de statistiques */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Carte Rendez-vous du jour */}
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">
              Rendez-vous aujourd'hui
            </CardTitle>
            <CalendarClock className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-sm text-muted-foreground">
              Dont 2 confirmés et 1 en attente
            </p>
          </CardContent>
        </Card>

        {/* Carte Patients */}
        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">
              Patients ce mois
            </CardTitle>
            <User className="h-6 w-6 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">42</div>
            <p className="text-sm text-muted-foreground">
              +5% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>

        {/* Carte Urgences */}
        <Card className="border-red-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Urgences</CardTitle>
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1</div>
            <p className="text-sm text-muted-foreground">
              Patient en salle 3 actuellement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Section principale */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Planning du jour */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              <span>Planning du jour</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">{appointment.patient}</p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.time}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      appointment.status === "confirmé"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </div>
              ))}
              {/* Bouton avec lien */}
              <Link
                to="/appointment-doctor"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Button variant="outline" className="w-full mt-4">
                  Voir tous les rendez-vous
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-3 rounded-lg border p-4 ${
                    notification.type === "emergency"
                      ? "border-red-200 bg-red-50"
                      : ""
                  }`}
                >
                  <div
                    className={`mt-1 h-3 w-3 rounded-full ${
                      notification.type === "emergency"
                        ? "bg-red-500"
                        : "bg-primary"
                    }`}
                  />
                  <p className="text-sm">{notification.message}</p>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4">
                Voir toutes les notifications
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
