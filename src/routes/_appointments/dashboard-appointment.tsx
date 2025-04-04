import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const Route = createFileRoute("/_appointments/dashboard-appointment")({
  component: RouteComponent,
});

// Mock data
const appointments = [
  {
    id: "1",
    patient: "Jean Dupont",
    specialty: "Cardiologie",
    doctor: "Dr. Martin",
    date: new Date(Date.now() + 3600000 * 2), // In 2 hours
    status: "confirmed",
    type: "Nouvelle consultation",
  },
  {
    id: "2",
    patient: "Marie Lambert",
    specialty: "Dermatologie",
    doctor: "Dr. Lefèvre",
    date: new Date(Date.now() + 86400000), // Tomorrow
    status: "confirmed",
    type: "Suivi",
  },
  {
    id: "3",
    patient: "Pierre Garnier",
    specialty: "Pédiatrie",
    doctor: "Dr. Petit",
    date: new Date(Date.now() - 3600000), // 1 hour ago
    status: "completed",
    type: "Vaccination",
  },
];

const notifications = [
  {
    id: "1",
    type: "reminder",
    content: "Rappel: Rendez-vous avec Dr. Martin dans 2 heures",
    date: new Date(),
    read: false,
  },
  {
    id: "2",
    type: "confirmation",
    content: "Le Dr. Lefèvre a confirmé votre rendez-vous de demain",
    date: new Date(Date.now() - 3600000 * 3),
    read: false,
  },
  {
    id: "3",
    type: "cancellation",
    content: "Le Dr. Bernard a annulé votre rendez-vous du 15/11",
    date: new Date(Date.now() - 86400000),
    read: true,
  },
];

function RouteComponent() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Update time every minute and check for notifications
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // In a real app, you would fetch new notifications here
    }, 60000);

    // Count unread notifications
    setUnreadNotifications(notifications.filter((n) => !n.read).length);

    return () => clearInterval(timer);
  }, []);

  // Calculate KPIs
  const todaysAppointments = appointments.filter(
    (app) =>
      format(app.date, "yyyy-MM-dd") === format(currentTime, "yyyy-MM-dd")
  ).length;

  const upcomingAppointments = appointments.filter(
    (app) => app.date > currentTime && app.status === "confirmed"
  ).length;

  const occupancyRate = Math.round(
    (appointments.filter((app) => app.status === "completed").length /
      appointments.length) *
      100
  );

  const markAsRead = (id: string) => {
    // In a real app, this would call an API
    const notification = notifications.find((n) => n.id === id);
    if (notification) notification.read = true;
    setUnreadNotifications(unreadNotifications - 1);
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case "reminder":
        return <Badge variant="secondary">Rappel</Badge>;
      case "confirmation":
        return <Badge className="bg-green-500">Confirmation</Badge>;
      case "cancellation":
        return <Badge variant="destructive">Annulation</Badge>;
      default:
        return <Badge>Notification</Badge>;
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <div className="text-sm text-muted-foreground">
          {format(currentTime, "PPPPp", { locale: fr })}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              RDV aujourd'hui
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M8 2v4M16 2v4M3 10h18M5 2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysAppointments}</div>
            <p className="text-xs text-muted-foreground">
              {todaysAppointments > 0
                ? `${todaysAppointments} rendez-vous programmés`
                : "Aucun rendez-vous aujourd'hui"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">RDV à venir</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments}</div>
            <p className="text-xs text-muted-foreground">
              Prochains rendez-vous confirmés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Taux d'occupation
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancyRate}%</div>
            <p className="text-xs text-muted-foreground">
              Sur les 30 derniers jours
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Prochains rendez-vous</CardTitle>
          </CardHeader>
          <CardContent>
            {appointments
              .filter(
                (app) => app.date > currentTime && app.status === "confirmed"
              )
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .slice(0, 5)
              .map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center py-3 border-b last:border-b-0"
                >
                  <div className="flex-shrink-0 mr-4">
                    <div className="text-lg font-medium">
                      {format(appointment.date, "HH:mm")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(appointment.date, "dd/MM")}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {appointment.patient}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {appointment.specialty} - {appointment.doctor}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Détails
                  </Button>
                </div>
              ))}

            {appointments.filter((app) => app.date > currentTime).length ===
              0 && (
              <p className="text-center text-muted-foreground py-6">
                Aucun rendez-vous à venir
              </p>
            )}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Notifications</CardTitle>
              {unreadNotifications > 0 && (
                <Badge variant="default">{unreadNotifications} non lus</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {notifications
              .sort((a, b) => b.date.getTime() - a.date.getTime())
              .slice(0, 5)
              .map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start py-3 border-b last:border-b-0 ${!notification.read ? "bg-muted/50" : ""}`}
                >
                  <div className="flex-shrink-0 mr-3 mt-1">
                    {getNotificationBadge(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{notification.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(notification.date, "PPPPp", { locale: fr })}
                    </p>
                  </div>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Marquer comme lu
                    </Button>
                  )}
                </div>
              ))}

            {notifications.length === 0 && (
              <p className="text-center text-muted-foreground py-6">
                Aucune notification
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
