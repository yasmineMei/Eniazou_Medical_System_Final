"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/_appointments/dashboard-appointment")({
  component: RouteComponent,
});

// Types
type Department = {
  id: string;
  name: string;
};

type Doctor = {
  id: string;
  name: string;
  departmentId: string;
};

type TimeSlot = {
  id: string;
  time: string;
  available: boolean;
};

type PatientInfo = {
  fullName: string;
  phone: string;
  email: string;
  notes: string;
};

type Appointment = {
  id: string;
  time: string;
  patientName: string;
  doctor: string;
  department: string;
  contact: string;
  status: "confirmed" | "pending" | "cancelled";
};

function RouteComponent() {
  const [currentTime] = useState(new Date());
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState<string>();
  const [selectedDoctor, setSelectedDoctor] = useState<string>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    fullName: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 5;

  // Données de la clinique
 const departments: Department[] = [
   { id: "medecine-generale", name: "Médecine générale" },
   { id: "pediatrie", name: "Pédiatrie" },
   { id: "gynecologie-obstetrique", name: "Gynécologie-obstétrique" },
   { id: "ophtalmologie", name: "Ophtalmologie" },
   { id: "chirurgie-generale", name: "Chirurgie générale" },
   { id: "radiologie", name: "Radiologie" },
   { id: "laboratoire", name: "Laboratoire" },
   { id: "soins-infirmiers", name: "Soins infirmiers" },
 ];


  const doctors: Doctor[] = [
    {
      id: "dr-kengani-medecine",
      name: "Dr. Kengani",
      departmentId: "medecine-generale",
    },
    {
      id: "dr-kengani-chirurgie",
      name: "Dr. Kengani",
      departmentId: "chirurgie-generale",
    },
    {
      id: "dr-kengani-pediatrie",
      name: "Dr. Kengani",
      departmentId: "pediatrie",
    },
    {
      id: "dr-loba",
      name: "Dr. Loba",
      departmentId: "ophtalmologie",
    },
    {
      id: "dr-meite",
      name: "Dr. Meite",
      departmentId: "radiologie",
    },
    {
      id: "dr-diallo",
      name: "Dr. Diallo",
      departmentId: "gynecologie-obstetrique",
    },
    {
      id: "dr-traore",
      name: "Dr. Traoré",
      departmentId: "laboratoire",
    },
    {
      id: "dr-kouame",
      name: "Dr. Kouamé",
      departmentId: "laboratoire",
    },
    {
      id: "infirmier-konan",
      name: "M. Konan",
      departmentId: "soins-infirmiers",
    },
    {
      id: "infirmiere-koffi",
      name: "Mme Koffi",
      departmentId: "soins-infirmiers",
    },
    {
      id: "infirmier-doumbia",
      name: "M. Doumbia",
      departmentId: "soins-infirmiers",
    },
    {
      id: "infirmiere-kone",
      name: "Mme Koné",
      departmentId: "soins-infirmiers",
    },
    {
      id: "infirmier-bamba",
      name: "M. Bamba",
      departmentId: "soins-infirmiers",
    },
    {
      id: "infirmiere-yao",
      name: "Mme Yao",
      departmentId: "soins-infirmiers",
    },
    {
      id: "infirmier-adi",
      name: "M. Adi",
      departmentId: "soins-infirmiers",
    },
  ];


  const timeSlots: TimeSlot[] = [
    { id: "1", time: "08:00", available: true,},
    { id: "2", time: "09:00", available: true,},
    { id: "3", time: "10:00", available: false,},
    { id: "4", time: "11:00", available: true },
    { id: "5", time: "14:00", available: true },
    { id: "6", time: "15:00", available: true },
    { id: "7", time: "16:00", available: true },
    { id: "8", time: "17:00", available: true },
  ];

  const appointmentsData: Appointment[] = [
    {
      id: "1",
      time: "09:00",
      patientName: "Moussa Diop",
      doctor: "Dr. Kengani",
      department: "Ophtalmologie",
      contact: "77 123 45 67",
      status: "confirmed",
    },
    {
      id: "2",
      time: "11:00",
      patientName: "Aminata Sow",
      doctor: "Dr. Diallo",
      department: "Maternité",
      contact: "76 234 56 78",
      status: "pending",
    },
    {
      id: "3",
      time: "14:00",
      patientName: "Jean Dupont",
      doctor: "Dr. Loba",
      department: "Chirurgie",
      contact: "70 345 67 89",
      status: "confirmed",
    },
    {
      id: "4",
      time: "15:00",
      patientName: "Marie Fall",
      doctor: "Dr. Sow",
      department: "Ophtalmologie",
      contact: "78 456 78 90",
      status: "cancelled",
    },
    {
      id: "5",
      time: "16:00",
      patientName: "Paul Martin",
      doctor: "Échographe",
      department: "Radiologie",
      contact: "77 567 89 01",
      status: "confirmed",
    },
    {
      id: "6",
      time: "17:00",
      patientName: "Sophie Diagne",
      doctor: "Dr. Diallo",
      department: "Maternité",
      contact: "76 678 90 12",
      status: "pending",
    },
  ];

  // Filtrer les médecins par département sélectionné
  const filteredDoctors = selectedDepartment
    ? doctors.filter((doctor) => doctor.departmentId === selectedDepartment)
    : [];

  // Filtrer les rendez-vous selon le terme de recherche
  const filteredAppointments = useMemo(() => {
    return appointmentsData.filter((appointment) => {
      return (
        appointment.patientName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.department
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        appointment.contact.includes(searchTerm)
      );
    });
  }, [searchTerm]);

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

  // Fonction pour obtenir la classe CSS selon le statut
  const getStatusClass = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Gérer la soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      date,
      department: selectedDepartment,
      doctor: selectedDoctor,
      time: selectedTime,
      patientInfo,
    });
    setIsDialogOpen(false);
    setPatientInfo({
      fullName: "",
      phone: "",
      email: "",
      notes: "",
    });
    setSelectedTime(undefined);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#018787]">
          Gestion des Rendez-vous
        </h1>
        <div className="text-sm text-muted-foreground">
          {format(currentTime, "PPPPp", { locale: fr })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calendrier */}
        <div className="md:col-span-1">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border shadow"
            locale={fr}
            fromDate={new Date()}
          />
        </div>

        {/* Sélection du département et médecin */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex gap-4">
            <Select
              value={selectedDepartment}
              onValueChange={(value) => {
                setSelectedDepartment(value);
                setSelectedDoctor(undefined);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner un département" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Départements</SelectLabel>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              value={selectedDoctor}
              onValueChange={setSelectedDoctor}
              disabled={!selectedDepartment}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner un médecin" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Médecins</SelectLabel>
                  {filteredDoctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Sélection de l'heure */}
          {selectedDoctor && date && (
            <div className="space-y-2">
              <h3 className="font-medium">Heures disponibles</h3>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot.id}
                    variant={selectedTime === slot.time ? "default" : "outline"}
                    disabled={!slot.available}
                    onClick={() => setSelectedTime(slot.time)}
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Bouton de réservation */}
          {selectedTime && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">Réserver ce rendez-vous</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Informations du patient</DialogTitle>
                  <DialogDescription>
                    Veuillez remplir les informations du patient pour confirmer
                    le rendez-vous.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="fullName" className="text-right">
                        Nom complet
                      </Label>
                      <Input
                        id="fullName"
                        value={patientInfo.fullName}
                        onChange={(e) =>
                          setPatientInfo({
                            ...patientInfo,
                            fullName: e.target.value,
                          })
                        }
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="phone" className="text-right">
                        Téléphone
                      </Label>
                      <Input
                        id="phone"
                        value={patientInfo.phone}
                        onChange={(e) =>
                          setPatientInfo({
                            ...patientInfo,
                            phone: e.target.value,
                          })
                        }
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={patientInfo.email}
                        onChange={(e) =>
                          setPatientInfo({
                            ...patientInfo,
                            email: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="notes" className="text-right">
                        Notes
                      </Label>
                      <Input
                        id="notes"
                        value={patientInfo.notes}
                        onChange={(e) =>
                          setPatientInfo({
                            ...patientInfo,
                            notes: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Confirmer le rendez-vous</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Liste des rendez-vous du jour avec recherche et pagination */}
      <div className="mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h2 className="text-xl font-semibold">Rendez-vous du jour</h2>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="rounded-md border shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-[#018787] hover:bg-[#018787]">
              <TableRow className="hover:bg-[#018787]">
                <TableHead className="text-white">Heure</TableHead>
                <TableHead className="text-white">Patient</TableHead>
                <TableHead className="text-white">Médecin</TableHead>
                <TableHead className="text-white">Département</TableHead>
                <TableHead className="text-white">Contact</TableHead>
                <TableHead className="text-white">Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentAppointments.length > 0 ? (
                currentAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">
                      {appointment.time}
                    </TableCell>
                    <TableCell>{appointment.patientName}</TableCell>
                    <TableCell>{appointment.doctor}</TableCell>
                    <TableCell>{appointment.department}</TableCell>
                    <TableCell>{appointment.contact}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(appointment.status)}`}
                      >
                        {appointment.status === "confirmed" && "Confirmé"}
                        {appointment.status === "pending" && "En attente"}
                        {appointment.status === "cancelled" && "Annulé"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
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
              {Math.min(indexOfLastAppointment, filteredAppointments.length)}{" "}
              sur {filteredAppointments.length} rendez-vous
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
      </div>
    </div>
  );
}
