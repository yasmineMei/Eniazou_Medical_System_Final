import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const Route = createFileRoute("/_appointments/suiviAppointment")({
  component: RouteComponent,
});

// Mock data
const appointments = [
  {
    id: "1",
    specialty: "Cardiologie",
    doctor: "Dr. Dupont",
    date: new Date(Date.now() + 86400000), // Tomorrow
    status: "confirmed",
    reason: "Consultation de routine",
  },
  {
    id: "2",
    specialty: "Dermatologie",
    doctor: "Dr. Martin",
    date: new Date(Date.now() - 86400000), // Yesterday
    status: "completed",
    reason: "Examen de la peau",
  },
  {
    id: "3",
    specialty: "Pédiatrie",
    doctor: "Dr. Petit",
    date: new Date(Date.now() + 3 * 86400000), // In 3 days
    status: "confirmed",
    reason: "Vaccination",
  },
  {
    id: "4",
    specialty: "Gynécologie",
    doctor: "Dr. Garcia",
    date: new Date(Date.now() - 3 * 86400000), // 3 days ago
    status: "cancelled",
    reason: "Consultation annuelle",
  },
];

const statusOptions = [
  { value: "all", label: "Tous les statuts" },
  { value: "confirmed", label: "Confirmé" },
  { value: "completed", label: "Terminé" },
  { value: "cancelled", label: "Annulé" },
];

const specialtyOptions = [
  { value: "all", label: "Toutes les spécialités" },
  { value: "Cardiologie", label: "Cardiologie" },
  { value: "Dermatologie", label: "Dermatologie" },
  { value: "Pédiatrie", label: "Pédiatrie" },
  { value: "Gynécologie", label: "Gynécologie" },
];

function RouteComponent() {
  const [dateFilter, setDateFilter] = useState<string>("");
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesDate =
      !dateFilter || format(appointment.date, "yyyy-MM-dd") === dateFilter;
    const matchesSpecialty =
      specialtyFilter === "all" || appointment.specialty === specialtyFilter;
    const matchesStatus =
      statusFilter === "all" || appointment.status === statusFilter;
    const matchesSearch =
      searchTerm === "" ||
      appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.reason.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesDate && matchesSpecialty && matchesStatus && matchesSearch;
  });

  const upcomingAppointments = filteredAppointments
    .filter((app) => app.date > new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const pastAppointments = filteredAppointments
    .filter((app) => app.date <= new Date())
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const handleCancelAppointment = (id: string) => {
    // In a real app, this would call an API
    console.log(`Annulation du rendez-vous ${id}`);
    alert(`Rendez-vous ${id} annulé avec succès`);
  };

  const handleModifyAppointment = (id: string) => {
    // In a real app, this would navigate to modification page
    console.log(`Modification du rendez-vous ${id}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Confirmé</Badge>
        );
      case "completed":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Terminé</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500 hover:bg-red-600">Annulé</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold">Suivi des rendez-vous</h1>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtrer les rendez-vous</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full"
              />
            </div>
            <Select onValueChange={setSpecialtyFilter} value={specialtyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Spécialité" />
              </SelectTrigger>
              <SelectContent>
                {specialtyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={setStatusFilter} value={statusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Rechercher (médecin ou motif)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Upcoming appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Rendez-vous à venir</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">
                        {appointment.specialty} - {appointment.doctor}
                      </h3>
                      {getStatusBadge(appointment.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(appointment.date, "PPPPp", { locale: fr })}
                    </p>
                    <p className="text-sm">{appointment.reason}</p>
                  </div>
                  <div className="flex gap-2 self-end md:self-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleModifyAppointment(appointment.id)}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancelAppointment(appointment.id)}
                      disabled={appointment.status === "cancelled"}
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Aucun rendez-vous à venir correspondant aux critères
            </p>
          )}
        </CardContent>
      </Card>

      {/* Past appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des rendez-vous</CardTitle>
        </CardHeader>
        <CardContent>
          {pastAppointments.length > 0 ? (
            <div className="space-y-4">
              {pastAppointments.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">
                      {appointment.specialty} - {appointment.doctor}
                    </h3>
                    {getStatusBadge(appointment.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(appointment.date, "PPPPp", { locale: fr })}
                  </p>
                  <p className="text-sm mt-1">{appointment.reason}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Aucun rendez-vous passé correspondant aux critères
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
