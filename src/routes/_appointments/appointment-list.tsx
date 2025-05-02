"use client";

import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  User,
  Clock,
  Stethoscope,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select";
import { Label } from "recharts";

type Appointment = {
  id: string;
  patientName: string;
  patientId: string;
  date: Date;
  time: string;
  doctor: string;
  service: string;
  status: "confirmé" | "annulé" | "terminé" | "en attente";
  notes?: string;
};

export const Route = createFileRoute("/_appointments/appointment-list")({
  component: AppointmentListPage,
});

function AppointmentListPage() {
  // États
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<
    Partial<Appointment>
  >({});
  const appointmentsPerPage = 10;

  // Données de démonstration
  useEffect(() => {
    const demoData: Appointment[] = [
      {
        id: "1",
        patientName: "Jean Dupont",
        patientId: "PAT-001",
        date: new Date(2023, 5, 15),
        time: "09:00",
        doctor: "Dr. Konan",
        service: "Consultation générale",
        status: "confirmé",
      },
      {
        id: "2",
        patientName: "Marie Lambert",
        patientId: "PAT-002",
        date: new Date(2023, 5, 15),
        time: "10:30",
        doctor: "Dr. Traoré",
        service: "Échographie",
        status: "en attente",
      },
      {
        id: "3",
        patientName: "Pierre Martin",
        patientId: "PAT-003",
        date: new Date(2023, 5, 16),
        time: "14:00",
        doctor: "Dr. Kouassi",
        service: "Suivi post-opératoire",
        status: "confirmé",
      },
      {
        id: "4",
        patientName: "Sophie N'Dri",
        patientId: "PAT-004",
        date: new Date(2023, 5, 16),
        time: "16:15",
        doctor: "Dr. Konan",
        service: "Vaccination",
        status: "annulé",
        notes: "Patient a reporté à la semaine prochaine",
      },
      {
        id: "5",
        patientName: "Paul Yao",
        patientId: "PAT-005",
        date: new Date(2023, 5, 17),
        time: "11:00",
        doctor: "Dr. Traoré",
        service: "Bilan sanguin",
        status: "terminé",
      },
    ];

    setAppointments(demoData);
    setFilteredAppointments(demoData);
  }, []);

  // Filtrage des rendez-vous
  useEffect(() => {
    const filtered = appointments.filter(
      (appt) =>
        appt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appt.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appt.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appt.service.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAppointments(filtered);
    setCurrentPage(1);
  }, [searchTerm, appointments]);

  // Pagination
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );
  const totalPages = Math.ceil(
    filteredAppointments.length / appointmentsPerPage
  );

  // Médecins et services disponibles
  const doctors = ["Dr. Konan", "Dr. Traoré", "Dr. Kouassi", "Dr. N'Guessan"];
  const services = [
    "Consultation générale",
    "Échographie",
    "Suivi post-opératoire",
    "Vaccination",
    "Bilan sanguin",
    "Radiologie",
    "Ophtalmologie",
  ];

  

  // Ouvrir le dialogue pour modifier un rendez-vous
  const openEditDialog = (appointment: Appointment) => {
    setCurrentAppointment({ ...appointment });
    setIsDialogOpen(true);
  };

  // Sauvegarder le rendez-vous
  const saveAppointment = () => {
    if (
      !currentAppointment.patientName ||
      !currentAppointment.date ||
      !currentAppointment.doctor
    ) {
      alert(
        "Veuillez remplir les champs obligatoires (Patient, Date et Médecin)"
      );
      return;
    }

    const newAppointment: Appointment = {
      id: currentAppointment.id || `appt-${Date.now()}`,
      patientName: currentAppointment.patientName,
      patientId: currentAppointment.patientId || "",
      date: currentAppointment.date as Date,
      time: currentAppointment.time || "00:00",
      doctor: currentAppointment.doctor,
      service: currentAppointment.service || "",
      status: currentAppointment.status || "en attente",
      notes: currentAppointment.notes,
    };

    if (currentAppointment.id) {
      // Modification
      setAppointments(
        appointments.map((appt) =>
          appt.id === currentAppointment.id ? newAppointment : appt
        )
      );
    } else {
      // Nouveau rendez-vous
      setAppointments([...appointments, newAppointment]);
    }

    setIsDialogOpen(false);
    setCurrentAppointment({});
  };

  // Supprimer un rendez-vous
  const deleteAppointment = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce rendez-vous ?")) {
      setAppointments(appointments.filter((appt) => appt.id !== id));
    }
  };

  // Formater la date
  const formatDate = (date: Date) => {
    return format(date, "PPP", { locale: fr });
  };

  // Obtenir la couleur du badge selon le statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmé":
        return "bg-green-500";
      case "annulé":
        return "bg-red-500";
      case "terminé":
        return "bg-blue-500";
      case "en attente":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-[#018787]">
          Liste des Rendez-vous
        </h1>

        <div className="flex items-center gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          
        </div>
      </div>

      <div className="rounded-md border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-[#018787]">
            <TableRow>
              <TableHead className="text-white">Patient</TableHead>
              <TableHead className="text-white">ID Patient</TableHead>
              <TableHead className="text-white">Date/Heure</TableHead>
              <TableHead className="text-white">Médecin</TableHead>
              <TableHead className="text-white">Service</TableHead>
              <TableHead className="text-white">Statut</TableHead>
              <TableHead className="text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentAppointments.length > 0 ? (
              currentAppointments.map((appt) => (
                <TableRow key={appt.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {appt.patientName}
                    </div>
                  </TableCell>
                  <TableCell>{appt.patientId}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{formatDate(appt.date)}</span>
                      <span className="flex items-center text-sm text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {appt.time}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4" />
                      {appt.doctor}
                    </div>
                  </TableCell>
                  <TableCell>{appt.service}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${getStatusColor(appt.status)} hover:${getStatusColor(appt.status)}`}
                    >
                      {appt.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditDialog(appt)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => deleteAppointment(appt.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  Aucun rendez-vous trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredAppointments.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Affichage de {indexOfFirstAppointment + 1} à{" "}
            {Math.min(indexOfLastAppointment, filteredAppointments.length)} sur{" "}
            {filteredAppointments.length} rendez-vous
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              Page {currentPage} sur {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Dialogue de gestion des rendez-vous */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentAppointment.id
                ? "Modifier le rendez-vous"
                : "Ajouter un nouveau rendez-vous"}
            </DialogTitle>
            <DialogDescription>
              Remplissez les détails du rendez-vous médical
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="patient-name" className="text-right">
                Patient
              </Label>
              <Input
                id="patient-name"
                value={currentAppointment.patientName || ""}
                onChange={(e) =>
                  setCurrentAppointment({
                    ...currentAppointment,
                    patientName: e.target.value,
                  })
                }
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="patient-id" className="text-right">
                ID Patient
              </Label>
              <Input
                id="patient-id"
                value={currentAppointment.patientId || ""}
                onChange={(e) =>
                  setCurrentAppointment({
                    ...currentAppointment,
                    patientId: e.target.value,
                  })
                }
                className="col-span-3"
                placeholder="Optionnel"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="appointment-date" className="text-right">
                Date
              </Label>
              <Input
                id="appointment-date"
                type="date"
                value={
                  currentAppointment.date
                    ? format(currentAppointment.date as Date, "yyyy-MM-dd")
                    : ""
                }
                onChange={(e) =>
                  setCurrentAppointment({
                    ...currentAppointment,
                    date: new Date(e.target.value),
                  })
                }
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="appointment-time" className="text-right">
                Heure
              </Label>
              <Input
                id="appointment-time"
                type="time"
                value={currentAppointment.time || ""}
                onChange={(e) =>
                  setCurrentAppointment({
                    ...currentAppointment,
                    time: e.target.value,
                  })
                }
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="appointment-doctor" className="text-right">
                Médecin
              </Label>
              <Select
                value={currentAppointment.doctor || ""}
                onValueChange={(value) =>
                  setCurrentAppointment({
                    ...currentAppointment,
                    doctor: value,
                  })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un médecin" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor} value={doctor}>
                      {doctor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="appointment-service" className="text-right">
                Service
              </Label>
              <Select
                value={currentAppointment.service || ""}
                onValueChange={(value) =>
                  setCurrentAppointment({
                    ...currentAppointment,
                    service: value,
                  })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="appointment-status" className="text-right">
                Statut
              </Label>
              <Select
                value={currentAppointment.status || ""}
                onValueChange={(value) =>
                  setCurrentAppointment({
                    ...currentAppointment,
                    status: value as
                      | "confirmé"
                      | "annulé"
                      | "terminé"
                      | "en attente",
                  })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en attente">En attente</SelectItem>
                  <SelectItem value="confirmé">Confirmé</SelectItem>
                  <SelectItem value="annulé">Annulé</SelectItem>
                  <SelectItem value="terminé">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="appointment-notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="appointment-notes"
                value={currentAppointment.notes || ""}
                onChange={(e) =>
                  setCurrentAppointment({
                    ...currentAppointment,
                    notes: e.target.value,
                  })
                }
                className="col-span-3"
                placeholder="Informations complémentaires"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={saveAppointment}>
              {currentAppointment.id ? "Enregistrer" : "Ajouter le rendez-vous"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
