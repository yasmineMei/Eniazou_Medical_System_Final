import { createFileRoute } from "@tanstack/react-router";
import {
  Plus,
  Check,
  Syringe,
  Droplets,
  Bandage,
  ClipboardList,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_nurse/constant")({
  component: ConstantsComponent,
});

function ConstantsComponent() {
  const [activeTab, setActiveTab] = useState("constants");
  const [vitals, setVitals] = useState({
    temperature: "",
    bloodPressure: "",
    pulse: "",
    oxygen: "",
    glucose: "",
  });

  const [careTasks, setCareTasks] = useState([
    {
      id: 1,
      type: "pansement",
      patient: "Marie Dupont",
      room: "204",
      done: false,
    },
    {
      id: 2,
      type: "injection",
      patient: "Jean Martin",
      room: "105",
      done: true,
    },
    {
      id: 3,
      type: "perfusion",
      patient: "Sophie Lambert",
      room: "302",
      done: false,
    },
  ]);

  const handleVitalChange = (field: string, value: string) => {
    setVitals((prev) => ({ ...prev, [field]: value }));
  };

  const toggleTaskStatus = (id: number) => {
    setCareTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
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
              <div className="mt-6 flex justify-end">
                <Button>Enregistrer</Button>
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
                    className={`flex items-center justify-between rounded-lg border p-4 ${task.done ? "bg-muted/50" : ""}`}
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
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Droplets className="h-6 w-6 text-green-500" />
                      <div>
                        <h3 className="font-medium">
                          Perfusion - Sophie Lambert
                        </h3>
                        <div className="text-sm text-muted-foreground">
                          Chambre 302 • NaCl 0.9% • Débit: 30 gouttes/min
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary">En cours</Badge>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm">
                      Début: 16/11/2023 14:30 • Durée estimée: 4h
                    </div>
                    <Button variant="outline" size="sm">
                      Modifier
                    </Button>
                  </div>
                </div>

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
