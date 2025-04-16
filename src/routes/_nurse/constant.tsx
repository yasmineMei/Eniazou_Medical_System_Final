import { createFileRoute } from "@tanstack/react-router";
import {
  Plus,
  Check,
  Syringe,
  Droplets,
  Bandage,
  ClipboardList,
  Save,
  Printer,
  Edit,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ConstantPDF } from "@/pdf/constantPDF";

export const Route = createFileRoute("/_nurse/constant")({
  component: ConstantsComponent,
});

type VitalSigns = {
  temperature: string;
  bloodPressure: string;
  pulse: string;
  oxygen: string;
  glucose: string;
};

type CareTask = {
  id: number;
  type: "pansement" | "injection" | "perfusion";
  patient: string;
  room: string;
  done: boolean;
  notes?: string;
};

type Infusion = {
  id: number;
  patient: string;
  room: string;
  solution: string;
  rate: string;
  status: "En cours" | "Terminée" | "Planifiée";
  startTime: string;
  estimatedDuration: string;
  notes?: string;
};

function ConstantsComponent() {
  const [activeTab, setActiveTab] = useState("constants");
  const [vitals, setVitals] = useState<VitalSigns>({
    temperature: "",
    bloodPressure: "",
    pulse: "",
    oxygen: "",
    glucose: "",
  });

  const [careTasks, setCareTasks] = useState<CareTask[]>([
    {
      id: 1,
      type: "pansement",
      patient: "Marie Dupont",
      room: "204",
      done: false,
      notes: "Changer pansement jambe gauche",
    },
    {
      id: 2,
      type: "injection",
      patient: "Jean Martin",
      room: "105",
      done: true,
      notes: "Insuline - 10 unités",
    },
    {
      id: 3,
      type: "perfusion",
      patient: "Sophie Lambert",
      room: "302",
      done: false,
      notes: "NaCl 0.9% - Surveillance toutes les heures",
    },
  ]);

  const [infusions, setInfusions] = useState<Infusion[]>([
    {
      id: 1,
      patient: "Sophie Lambert",
      room: "302",
      solution: "NaCl 0.9%",
      rate: "30 gouttes/min",
      status: "En cours",
      startTime: "2023-11-16T14:30:00",
      estimatedDuration: "4h",
      notes: "Surveiller le point de ponction",
    },
  ]);

  const handleVitalChange = (field: keyof VitalSigns, value: string) => {
    setVitals((prev) => ({ ...prev, [field]: value }));
  };

  const toggleTaskStatus = (id: number) => {
    setCareTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const handleSaveVitals = () => {
    // Ici, vous devriez envoyer les données à votre API
    console.log("Constantes enregistrées:", vitals);
    // Réinitialiser le formulaire après enregistrement
    setVitals({
      temperature: "",
      bloodPressure: "",
      pulse: "",
      oxygen: "",
      glucose: "",
    });
  };

  const clinicData = {
    nom: "Clinique Médicale",
    adresse: "123 Rue de la Santé, 75000 Paris",
    telephone: "01 23 45 67 89",
    email: "contact@clinique.fr",
  };

  const currentPatient = {
    id: "P-1001",
    name: "Marie Dupont",
    room: "204",
    age: 42,
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Soins & Constantes</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle saisie
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="constants">
            <ClipboardList className="mr-2 h-4 w-4" />
            Constantes
          </TabsTrigger>
          <TabsTrigger value="care">
            <Bandage className="mr-2 h-4 w-4" />
            Soins
          </TabsTrigger>
          <TabsTrigger value="perfusion">
            <Droplets className="mr-2 h-4 w-4" />
            Perfusions
          </TabsTrigger>
        </TabsList>

        {/* Onglet Constantes */}
        <TabsContent value="constants">
          <Card>
            <CardHeader>
              <CardTitle>Saisie des constantes vitales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Température (°C)
                  </label>
                  <Input
                    placeholder="36.5 - 37.5"
                    value={vitals.temperature}
                    onChange={(e) =>
                      handleVitalChange("temperature", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Pression artérielle
                  </label>
                  <Input
                    placeholder="120/80"
                    value={vitals.bloodPressure}
                    onChange={(e) =>
                      handleVitalChange("bloodPressure", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pouls (bpm)</label>
                  <Input
                    placeholder="60-100"
                    value={vitals.pulse}
                    onChange={(e) => handleVitalChange("pulse", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">SpO2 (%)</label>
                  <Input
                    placeholder="95-100"
                    value={vitals.oxygen}
                    onChange={(e) =>
                      handleVitalChange("oxygen", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Glycémie (mg/dL)
                  </label>
                  <Input
                    placeholder="70-110"
                    value={vitals.glucose}
                    onChange={(e) =>
                      handleVitalChange("glucose", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                {Object.values(vitals).some((val) => val !== "") && (
                  <PDFDownloadLink
                    document={
                      <ConstantPDF
                        clinic={clinicData}
                        patient={currentPatient}
                        vitals={vitals}
                        date={new Date().toISOString()}
                      />
                    }
                    fileName={`constantes_${currentPatient.name}_${new Date().toISOString().slice(0, 10)}.pdf`}
                  >
                    {({ loading }) => (
                      <Button variant="outline" disabled={loading}>
                        <Printer className="mr-2 h-4 w-4" />
                        {loading ? "Génération..." : "Imprimer"}
                      </Button>
                    )}
                  </PDFDownloadLink>
                )}
                <Button onClick={handleSaveVitals}>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Soins */}
        <TabsContent value="care">
          <Card>
            <CardHeader>
              <CardTitle>Checklist des soins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {careTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between rounded-lg border p-4 ${
                      task.done ? "bg-muted/50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {task.type === "pansement" && (
                        <Bandage className="h-5 w-5 text-blue-500" />
                      )}
                      {task.type === "injection" && (
                        <Syringe className="h-5 w-5 text-orange-500" />
                      )}
                      {task.type === "perfusion" && (
                        <Droplets className="h-5 w-5 text-green-500" />
                      )}
                      <div>
                        <h3 className="capitalize font-medium">
                          {task.type} - {task.patient}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Chambre {task.room}
                        </p>
                        {task.notes && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {task.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant={task.done ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleTaskStatus(task.id)}
                    >
                      {task.done ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Terminé
                        </>
                      ) : (
                        "À faire"
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Perfusions */}
        <TabsContent value="perfusion">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des perfusions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {infusions.map((infusion) => (
                  <div key={infusion.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Droplets className="h-6 w-6 text-green-500" />
                        <div>
                          <h3 className="font-medium">
                            Perfusion - {infusion.patient}
                          </h3>
                          <div className="text-sm text-muted-foreground">
                            Chambre {infusion.room} • {infusion.solution} •
                            Débit: {infusion.rate}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={
                          infusion.status === "En cours"
                            ? "default"
                            : infusion.status === "Terminée"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {infusion.status}
                      </Badge>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm">
                        Début: {new Date(infusion.startTime).toLocaleString()} •
                        Durée estimée: {infusion.estimatedDuration}
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </Button>
                    </div>
                    {infusion.notes && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        Notes: {infusion.notes}
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex justify-center">
                  <Button variant="ghost">
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter une perfusion
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
