import { createFileRoute } from "@tanstack/react-router";
import {
  Search,
  
  User,
  Calendar,
  Clock,
  Frown,
  
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_nurse/fiche-patient")({
  component: PatientFileComponent,
});

// Données simulées
const patients = [
  {
    id: "P-1001",
    name: "Marie Dupont",
    age: 42,
    room: "Ch. 204",
    status: "Urgent",
    lastVisit: "2023-11-15",
    alert: "Allergie pénicilline",
  },
  {
    id: "P-1002",
    name: "Jean Martin",
    age: 68,
    room: "Ch. 105",
    status: "Stable",
    lastVisit: "2023-11-16",
    alert: null,
  },
  {
    id: "P-1003",
    name: "Sophie Lambert",
    age: 35,
    room: "Ch. 302",
    status: "Observation",
    lastVisit: "2023-11-16",
    alert: "Diabétique",
  },
];

function PatientFileComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "today">("today");

  // Filtrage des patients
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      patient.lastVisit === new Date().toISOString().split("T")[0];
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* En-tête avec recherche */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Gestion des Patients</h1>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher patient..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-4">
        <Button
          variant={filter === "today" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("today")}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Patients du jour
        </Button>
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          <User className="mr-2 h-4 w-4" />
          Tous les patients
        </Button>
      </div>

      {/* Liste des patients */}
      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">Liste</TabsTrigger>
          <TabsTrigger value="details">Détails</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <div className="rounded-lg border">
            {filteredPatients.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center gap-2 text-muted-foreground">
                <Frown className="h-8 w-8" />
                <p>Aucun patient trouvé</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-4 hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-primary/10 p-3">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{patient.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>ID: {patient.id}</span>
                          <span>•</span>
                          <span>{patient.age} ans</span>
                          <span>•</span>
                          <span>{patient.room}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {patient.alert && (
                        <Badge variant="destructive">{patient.alert}</Badge>
                      )}
                      <Badge
                        variant={
                          patient.status === "Urgent"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {patient.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Voir fiche
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="details">
          {/* Exemple de fiche patient détaillée */}
          <div className="rounded-lg border p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">Marie Dupont</h2>
                <div className="mt-2 flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    42 ans
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Dernière visite: 15/11/2023
                  </span>
                </div>
              </div>
              <Badge variant="destructive">Urgent</Badge>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-4 font-semibold">Informations médicales</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Allergies</p>
                    <p>Pénicilline, Aspirine</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Antécédents</p>
                    <p>Hypertension, Diabète type 2</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 font-semibold">Traitements en cours</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded border p-3">
                    <div>
                      <p className="font-medium">Metformine 500mg</p>
                      <p className="text-sm text-muted-foreground">
                        2x/jour - Matin/Soir
                      </p>
                    </div>
                    <Badge variant="outline">En cours</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
