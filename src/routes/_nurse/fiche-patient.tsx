import { createFileRoute } from "@tanstack/react-router";
import {
  Search,
  User,
  Calendar,
  Frown,
  X,
  AlertTriangle,
  Pill,
  HeartPulse,
  Edit,
  Save,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_nurse/fiche-patient")({
  component: PatientFileComponent,
});

type Treatment = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  status: "En cours" | "Terminé" | "À commencer";
};

type PatientStatus = "Urgent" | "Stable" | "Observation";

type Patient = {
  id: string;
  name: string;
  age: number;
  room: string;
  status: PatientStatus;
  lastVisit: string;
  alert: string | null;
  allergies: string[];
  medicalHistory: string[];
  treatments: Treatment[];
};

const initialPatients: Patient[] = [
  {
    id: "P-1001",
    name: "Marie Dupont",
    age: 42,
    room: "Ch. 204",
    status: "Urgent",
    lastVisit: new Date().toISOString().split("T")[0],
    alert: "Allergie pénicilline",
    allergies: ["Pénicilline", "Aspirine"],
    medicalHistory: ["Hypertension", "Diabète type 2"],
    treatments: [
      {
        id: "T-001",
        name: "Metformine 500mg",
        dosage: "500mg",
        frequency: "2x/jour - Matin/Soir",
        status: "En cours",
      },
      {
        id: "T-002",
        name: "Lisinopril 10mg",
        dosage: "10mg",
        frequency: "1x/jour - Matin",
        status: "En cours",
      },
    ],
  },
  {
    id: "P-1002",
    name: "Jean Martin",
    age: 68,
    room: "Ch. 105",
    status: "Stable",
    lastVisit: new Date().toISOString().split("T")[0],
    alert: null,
    allergies: [],
    medicalHistory: ["Cholestérol élevé", "Arthrite"],
    treatments: [
      {
        id: "T-003",
        name: "Atorvastatine 20mg",
        dosage: "20mg",
        frequency: "1x/jour - Soir",
        status: "En cours",
      },
    ],
  },
  {
    id: "P-1003",
    name: "Sophie Lambert",
    age: 35,
    room: "Ch. 302",
    status: "Observation",
    lastVisit: "2023-11-16",
    alert: "Diabétique",
    allergies: ["Latex"],
    medicalHistory: ["Diabète type 1"],
    treatments: [
      {
        id: "T-004",
        name: "Insuline glargine",
        dosage: "20 unités",
        frequency: "1x/jour - Soir",
        status: "En cours",
      },
    ],
  },
];

function PatientFileComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "today">("today");
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPatient, setEditedPatient] = useState<Patient | null>(null);

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

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setEditedPatient(JSON.parse(JSON.stringify(patient))); // Deep copy
    setIsDialogOpen(true);
    setIsEditing(false);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedPatient(null);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!editedPatient || !selectedPatient) return;

    // Mise à jour de la liste des patients
    const updatedPatients = patients.map((p) =>
      p.id === selectedPatient.id ? editedPatient : p
    );

    setPatients(updatedPatients);
    setSelectedPatient(editedPatient);
    setIsEditing(false);
  };

  const handleFieldChange = <K extends keyof Patient>(
    field: K,
    value: Patient[K]
  ) => {
    if (editedPatient) {
      setEditedPatient({
        ...editedPatient,
        [field]: value,
      });
    }
  };

  const handleTreatmentChange = (
    treatmentId: string,
    field: keyof Treatment,
    value: string
  ) => {
    if (!editedPatient) return;

    const updatedTreatments = editedPatient.treatments.map((treatment) =>
      treatment.id === treatmentId
        ? { ...treatment, [field]: value }
        : treatment
    );

    setEditedPatient({
      ...editedPatient,
      treatments: updatedTreatments,
    });
  };

  const addNewTreatment = () => {
    if (!editedPatient) return;

    const newTreatment: Treatment = {
      id: `T-${Date.now()}`,
      name: "",
      dosage: "",
      frequency: "",
      status: "En cours",
    };

    setEditedPatient({
      ...editedPatient,
      treatments: [...editedPatient.treatments, newTreatment],
    });
  };

  const removeTreatment = (treatmentId: string) => {
    if (!editedPatient) return;

    setEditedPatient({
      ...editedPatient,
      treatments: editedPatient.treatments.filter((t) => t.id !== treatmentId),
    });
  };

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
                    className="flex flex-col items-start justify-between gap-4 p-4 hover:bg-muted/50 sm:flex-row sm:items-center sm:gap-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-primary/10 p-3">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{patient.name}</h3>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          <span>ID: {patient.id}</span>
                          <span>•</span>
                          <span>{patient.age} ans</span>
                          <span>•</span>
                          <span>{patient.room}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                      {patient.alert && (
                        <Badge variant="destructive">{patient.alert}</Badge>
                      )}
                      <Badge
                        variant={
                          patient.status === "Urgent"
                            ? "destructive"
                            : patient.status === "Stable"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {patient.status}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewPatient(patient)}
                      >
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
          <div className="rounded-lg border p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">Fiche Patient</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Sélectionnez un patient dans la liste pour voir ses détails
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogue pour afficher la fiche patient */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedPatient && editedPatient && (
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <Input
                      value={editedPatient.name}
                      onChange={(e) =>
                        handleFieldChange("name", e.target.value)
                      }
                      className="text-xl font-bold w-full"
                    />
                  ) : (
                    <span>Fiche Patient: {selectedPatient.name}</span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeDialog}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogTitle>
              <DialogDescription>
                {isEditing ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <Input
                      value={editedPatient.id}
                      onChange={(e) => handleFieldChange("id", e.target.value)}
                      className="w-24"
                      disabled
                    />
                    <Input
                      type="number"
                      value={editedPatient.age}
                      onChange={(e) =>
                        handleFieldChange("age", parseInt(e.target.value) || 0)
                      }
                      className="w-16"
                    />
                    ans
                    <Input
                      value={editedPatient.room}
                      onChange={(e) =>
                        handleFieldChange("room", e.target.value)
                      }
                      className="w-24"
                    />
                  </div>
                ) : (
                  `ID: ${selectedPatient.id} • ${selectedPatient.age} ans • ${selectedPatient.room}`
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              {/* Statut et alertes */}
              <div className="flex flex-wrap items-center gap-2">
                {isEditing ? (
                  <>
                    <Select
                      value={editedPatient.status}
                      onValueChange={(value) =>
                        handleFieldChange("status", value as PatientStatus)
                      }
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                        <SelectItem value="Stable">Stable</SelectItem>
                        <SelectItem value="Observation">Observation</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      value={editedPatient.alert || ""}
                      onChange={(e) =>
                        handleFieldChange("alert", e.target.value || null)
                      }
                      placeholder="Alerte médicale"
                      className="w-48"
                    />
                  </>
                ) : (
                  <>
                    <Badge
                      variant={
                        selectedPatient.status === "Urgent"
                          ? "destructive"
                          : selectedPatient.status === "Stable"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {selectedPatient.status}
                    </Badge>
                    {selectedPatient.alert && (
                      <Badge
                        variant="destructive"
                        className="flex items-center gap-1"
                      >
                        <AlertTriangle className="h-3 w-3" />
                        {selectedPatient.alert}
                      </Badge>
                    )}
                  </>
                )}
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Dernière visite:{" "}
                  {new Date(selectedPatient.lastVisit).toLocaleDateString(
                    "fr-FR"
                  )}
                </span>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Informations médicales */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <HeartPulse className="h-5 w-5" />
                    Informations médicales
                  </h3>
                  <div>
                    <p className="text-sm text-muted-foreground">Allergies</p>
                    {isEditing ? (
                      <Textarea
                        value={editedPatient.allergies.join(", ")}
                        onChange={(e) =>
                          handleFieldChange(
                            "allergies",
                            e.target.value
                              .split(",")
                              .map((item) => item.trim())
                              .filter((item) => item)
                          )
                        }
                        placeholder="Saisir les allergies séparées par des virgules"
                      />
                    ) : (
                      <p>
                        {selectedPatient.allergies.length > 0
                          ? selectedPatient.allergies.join(", ")
                          : "Aucune allergie connue"}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Antécédents</p>
                    {isEditing ? (
                      <Textarea
                        value={editedPatient.medicalHistory.join(", ")}
                        onChange={(e) =>
                          handleFieldChange(
                            "medicalHistory",
                            e.target.value
                              .split(",")
                              .map((item) => item.trim())
                              .filter((item) => item)
                          )
                        }
                        placeholder="Saisir les antécédents séparés par des virgules"
                      />
                    ) : (
                      <p>
                        {selectedPatient.medicalHistory.length > 0
                          ? selectedPatient.medicalHistory.join(", ")
                          : "Aucun antécédent notable"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Traitements en cours */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Pill className="h-5 w-5" />
                      Traitements en cours
                    </h3>
                    {isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addNewTreatment}
                      >
                        Ajouter traitement
                      </Button>
                    )}
                  </div>
                  {editedPatient.treatments.length > 0 ? (
                    <div className="space-y-2">
                      {editedPatient.treatments.map((treatment) => (
                        <div
                          key={treatment.id}
                          className="flex flex-col gap-2 rounded border p-3"
                        >
                          {isEditing ? (
                            <>
                              <div className="flex gap-2">
                                <Input
                                  value={treatment.name}
                                  onChange={(e) =>
                                    handleTreatmentChange(
                                      treatment.id,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Nom du traitement"
                                  className="flex-1"
                                />
                                {isEditing && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9"
                                    onClick={() =>
                                      removeTreatment(treatment.id)
                                    }
                                  >
                                    <X className="h-4 w-4 text-destructive" />
                                  </Button>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Input
                                  value={treatment.dosage}
                                  onChange={(e) =>
                                    handleTreatmentChange(
                                      treatment.id,
                                      "dosage",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Dosage"
                                />
                                <Input
                                  value={treatment.frequency}
                                  onChange={(e) =>
                                    handleTreatmentChange(
                                      treatment.id,
                                      "frequency",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Fréquence"
                                />
                              </div>
                              <Select
                                value={treatment.status}
                                onValueChange={(value) =>
                                  handleTreatmentChange(
                                    treatment.id,
                                    "status",
                                    value
                                  )
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="Statut" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="En cours">
                                    En cours
                                  </SelectItem>
                                  <SelectItem value="Terminé">
                                    Terminé
                                  </SelectItem>
                                  <SelectItem value="À commencer">
                                    À commencer
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </>
                          ) : (
                            <>
                              <p className="font-medium">{treatment.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {treatment.dosage} • {treatment.frequency}
                              </p>
                              <Badge variant="outline" className="self-end">
                                {treatment.status}
                              </Badge>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Aucun traitement en cours
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="flex items-center gap-1"
                    >
                      <Save className="h-4 w-4" />
                      Enregistrer
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={closeDialog}>
                      Fermer
                    </Button>
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      Modifier la fiche
                    </Button>
                  </>
                )}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
