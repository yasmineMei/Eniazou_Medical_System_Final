import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const Route = createFileRoute("/_appointments/priseAppointment")({
  component: RouteComponent,
});

// Mock data
const specialties = [
  { id: "1", name: "Cardiologie" },
  { id: "2", name: "Dermatologie" },
  { id: "3", name: "Pédiatrie" },
  { id: "4", name: "Gynécologie" },
];

const doctors = {
  "1": [
    {
      id: "101",
      name: "Dr. Dupont",
      availableSlots: ["2023-11-15T09:00", "2023-11-15T11:00"],
    },
    {
      id: "102",
      name: "Dr. Martin",
      availableSlots: ["2023-11-16T10:00", "2023-11-16T14:00"],
    },
  ],
  "2": [
    {
      id: "201",
      name: "Dr. Leroy",
      availableSlots: ["2023-11-17T09:00", "2023-11-17T13:00"],
    },
  ],
  "3": [
    {
      id: "301",
      name: "Dr. Petit",
      availableSlots: ["2023-11-18T10:00", "2023-11-18T15:00"],
    },
    {
      id: "302",
      name: "Dr. Blanc",
      availableSlots: ["2023-11-19T09:00", "2023-11-19T11:00"],
    },
  ],
  "4": [
    {
      id: "401",
      name: "Dr. Garcia",
      availableSlots: ["2023-11-20T09:00", "2023-11-20T16:00"],
    },
  ],
};

function RouteComponent() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNextStep = () => {
    // Validate current step before proceeding
    if (step === 1 && !selectedSpecialty) {
      setErrors({ specialty: "Veuillez sélectionner une spécialité" });
      return;
    }
    if (step === 2 && (!selectedDoctor || !selectedDate || !selectedTime)) {
      const newErrors: Record<string, string> = {};
      if (!selectedDoctor)
        newErrors.doctor = "Veuillez sélectionner un médecin";
      if (!selectedDate) newErrors.date = "Veuillez sélectionner une date";
      if (!selectedTime) newErrors.time = "Veuillez sélectionner un horaire";
      setErrors(newErrors);
      return;
    }

    setErrors({});
    if (step < 3) setStep((step + 1) as 1 | 2 | 3);
  };

  const handleSubmit = () => {
    // Here you would typically send the appointment data to your backend
    console.log({
      specialty: selectedSpecialty,
      doctor: selectedDoctor,
      date: selectedDate,
      time: selectedTime,
    });
    alert("Rendez-vous confirmé avec succès!");
  };

  const availableDoctors = selectedSpecialty
    ? doctors[selectedSpecialty as keyof typeof doctors] || []
    : [];
  const availableTimes =
    selectedDoctor && selectedDate
      ? availableDoctors.find((d) => d.id === selectedDoctor)?.availableSlots ||
        []
      : [];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Prendre un rendez-vous</h1>

      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-6">
        <div
          className={`flex flex-col items-center ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          >
            1
          </div>
          <span className="text-sm mt-1">Spécialité</span>
        </div>
        <div
          className={`flex-1 h-1 mx-2 ${step >= 2 ? "bg-primary" : "bg-muted"}`}
        ></div>
        <div
          className={`flex flex-col items-center ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          >
            2
          </div>
          <span className="text-sm mt-1">Disponibilité</span>
        </div>
        <div
          className={`flex-1 h-1 mx-2 ${step >= 3 ? "bg-primary" : "bg-muted"}`}
        ></div>
        <div
          className={`flex flex-col items-center ${step >= 3 ? "text-primary" : "text-muted-foreground"}`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          >
            3
          </div>
          <span className="text-sm mt-1">Confirmation</span>
        </div>
      </div>

      {/* Step 1: Specialty selection */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Choisissez une spécialité</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              onValueChange={setSelectedSpecialty}
              value={selectedSpecialty}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez une spécialité" />
              </SelectTrigger>
              <SelectContent>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty.id} value={specialty.id}>
                    {specialty.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.specialty && (
              <p className="text-sm text-destructive mt-2">
                {errors.specialty}
              </p>
            )}
            <div className="flex justify-end mt-6">
              <Button onClick={handleNextStep} disabled={!selectedSpecialty}>
                Suivant
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Doctor and time selection */}
      {step === 2 && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Choisissez un médecin</CardTitle>
            </CardHeader>
            <CardContent>
              <Select onValueChange={setSelectedDoctor} value={selectedDoctor}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez un médecin" />
                </SelectTrigger>
                <SelectContent>
                  {availableDoctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.doctor && (
                <p className="text-sm text-destructive mt-2">{errors.doctor}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Choisissez une date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                locale={fr}
                disabled={(date) =>
                  date < new Date() ||
                  date >
                    new Date(new Date().setMonth(new Date().getMonth() + 3))
                }
              />
              {errors.date && (
                <p className="text-sm text-destructive mt-2">{errors.date}</p>
              )}
            </CardContent>
          </Card>

          {selectedDate && selectedDoctor && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Choisissez un horaire</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {availableTimes.map((time) => {
                    const timeStr = new Date(time).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    return (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        onClick={() => setSelectedTime(time)}
                      >
                        {timeStr}
                      </Button>
                    );
                  })}
                </div>
                {errors.time && (
                  <p className="text-sm text-destructive mt-2">{errors.time}</p>
                )}
              </CardContent>
            </Card>
          )}

          <div className="md:col-span-2 flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              Retour
            </Button>
            <Button
              onClick={handleNextStep}
              disabled={!selectedDoctor || !selectedDate || !selectedTime}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Confirmez votre rendez-vous</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Spécialité
                </h3>
                <p>
                  {specialties.find((s) => s.id === selectedSpecialty)?.name}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Médecin
                </h3>
                <p>
                  {availableDoctors.find((d) => d.id === selectedDoctor)?.name}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Date et heure
                </h3>
                <p>
                  {selectedDate && format(selectedDate, "PPPP", { locale: fr })}{" "}
                  à{" "}
                  {selectedTime &&
                    new Date(selectedTime).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </p>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={() => setStep(2)}>
                Retour
              </Button>
              <Button onClick={handleSubmit}>Confirmer le rendez-vous</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
