"use client";

import * as React from "react";
import { useState } from "react";
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

  // Données de la clinique
  const departments: Department[] = [
    { id: "ophtalmologie", name: "Ophtalmologie" },
    { id: "chirurgie", name: "Chirurgie" },
    { id: "radiologie", name: "Radiologie" },
    { id: "maternite", name: "Maternité" },
  ];

  const doctors: Doctor[] = [
    { id: "dr-kengani", name: "Dr. Kengani", departmentId: "ophtalmologie" },
    { id: "dr-loba", name: "Dr. Loba", departmentId: "chirurgie" },
    { id: "echographe", name: "Échographe", departmentId: "radiologie" },
    { id: "dr-sow", name: "Dr. Sow", departmentId: "ophtalmologie" },
    { id: "dr-diallo", name: "Dr. Diallo", departmentId: "maternite" },
  ];

  const timeSlots: TimeSlot[] = [
    { id: "1", time: "08:00", available: true },
    { id: "2", time: "09:00", available: true },
    { id: "3", time: "10:00", available: false },
    { id: "4", time: "11:00", available: true },
    { id: "5", time: "14:00", available: true },
    { id: "6", time: "15:00", available: true },
    { id: "7", time: "16:00", available: true },
    { id: "8", time: "17:00", available: true },
  ];

  // Filtrer les médecins par département sélectionné
  const filteredDoctors = selectedDepartment
    ? doctors.filter((doctor) => doctor.departmentId === selectedDepartment)
    : [];

  // Gérer la soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici vous ajouterez la logique pour enregistrer le rendez-vous
    console.log({
      date,
      department: selectedDepartment,
      doctor: selectedDoctor,
      time: selectedTime,
      patientInfo,
    });
    setIsDialogOpen(false);
    // Réinitialiser les champs
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
                setSelectedDoctor(undefined); // Réinitialiser le médecin quand on change de département
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

      {/* Liste des rendez-vous du jour */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Rendez-vous du jour</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Heure</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Médecin</TableHead>
              <TableHead>Département</TableHead>
              <TableHead>Contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Exemple de données - à remplacer par vos vraies données */}
            <TableRow>
              <TableCell>09:00</TableCell>
              <TableCell>Moussa Diop</TableCell>
              <TableCell>Dr. Kengani</TableCell>
              <TableCell>Ophtalmologie</TableCell>
              <TableCell>77 123 45 67</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>11:00</TableCell>
              <TableCell>Aminata Sow</TableCell>
              <TableCell>Dr. Diallo</TableCell>
              <TableCell>Maternité</TableCell>
              <TableCell>76 234 56 78</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
