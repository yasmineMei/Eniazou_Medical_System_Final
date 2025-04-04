import { createFileRoute } from "@tanstack/react-router";
import { Check, Pill, ClipboardList, ShoppingCart, Search, Clock } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";


export const Route = createFileRoute("/_nurse/patient-medecine")({
  component: MedicineComponent,
});

const medicinesData = [
  {
    id: "M-1001",
    patient: "Marie Dupont",
    room: "204",
    time: "08:00",
    medicine: "Paracétamol 1g",
    dosage: "1 comprimé",
    status: "pending",
    notes: "À prendre avec de l'eau",
  },
  {
    id: "M-1002",
    patient: "Jean Martin",
    room: "105",
    time: "12:00",
    medicine: "Amoxicilline 500mg",
    dosage: "2 comprimés",
    status: "pending",
    notes: "Allergie connue à la pénicilline",
  },
  {
    id: "M-1003",
    patient: "Sophie Lambert",
    room: "302",
    time: "18:00",
    medicine: "Insuline glargine",
    dosage: "10 unités",
    status: "completed",
    notes: "Injection sous-cutanée",
  },
];

const cartItems = [
  {
    id: "C-1001",
    medicine: "Paracétamol 1g",
    quantity: 20,
    critical: false,
  },
  {
    id: "C-1002",
    medicine: "Amoxicilline 500mg",
    quantity: 15,
    critical: true,
  },
  {
    id: "C-1003",
    medicine: "Insuline glargine",
    quantity: 5,
    critical: true,
  },
];

function MedicineComponent() {
  const [activeTab, setActiveTab] = useState("prescriptions");
  const [searchTerm, setSearchTerm] = useState("");
  const [comment, setComment] = useState("");
  const [selectedMed, setSelectedMed] = useState("");

  const filteredMeds = medicinesData.filter(
    (med) =>
      med.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.medicine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdminister = (id: string) => {
    // En réalité, on ferait une requête API ici
    setSelectedMed(id);
  };

  const confirmAdministration = () => {
    // Logique de confirmation
    setSelectedMed("");
    setComment("");
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestion des Médicaments</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="prescriptions">
            <ClipboardList className="mr-2 h-4 w-4" />
            Ordonnances
          </TabsTrigger>
          <TabsTrigger value="cart">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Chariot
          </TabsTrigger>
        </TabsList>

        {/* Onglet Ordonnances */}
        <TabsContent value="prescriptions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-primary" />
                Médicaments à administrer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredMeds.length === 0 ? (
                  <div className="flex h-32 items-center justify-center text-muted-foreground">
                    Aucune ordonnance trouvée
                  </div>
                ) : (
                  filteredMeds.map((med) => (
                    <div key={med.id} className="rounded-lg border p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">
                            {med.patient} - Ch. {med.room}
                          </h3>
                          <div className="mt-2 grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Médicament
                              </p>
                              <p>{med.medicine}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Dosage
                              </p>
                              <p>{med.dosage}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Heure
                              </p>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{med.time}</span>
                                {med.status === "completed" && (
                                  <Badge variant="default">
                                    <Check className="mr-1 h-3 w-3" />
                                    Administré
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          {med.notes && (
                            <div className="mt-2">
                              <p className="text-sm text-muted-foreground">
                                Notes
                              </p>
                              <p className="text-sm">{med.notes}</p>
                            </div>
                          )}
                        </div>
                        {med.status === "pending" && (
                          <Button
                            variant="outline"
                            onClick={() => handleAdminister(med.id)}
                          >
                            Administrer
                          </Button>
                        )}
                      </div>

                      {/* Formulaire d'administration (conditionnel) */}
                      {selectedMed === med.id && (
                        <div className="mt-4 space-y-3 rounded bg-muted/50 p-3">
                          <h4 className="font-medium">
                            Confirmation d'administration
                          </h4>
                          <Input
                            placeholder="Ajouter un commentaire..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          />
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setSelectedMed("")}
                            >
                              Annuler
                            </Button>
                            <Button onClick={confirmAdministration}>
                              <Check className="mr-2 h-4 w-4" />
                              Confirmer
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Chariot */}
        <TabsContent value="cart" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                État du chariot médical
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <Pill
                        className={`h-6 w-6 ${item.critical ? "text-destructive" : "text-primary"}`}
                      />
                      <div>
                        <h3 className="font-medium">{item.medicine}</h3>
                        <p className="text-sm text-muted-foreground">
                          Stock: {item.quantity}{" "}
                          {item.quantity <= 5 && "(CRITIQUE)"}
                        </p>
                      </div>
                    </div>
                    {item.critical && (
                      <Badge variant="destructive">À réapprovisionner</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t px-6 py-3">
              <div className="text-sm text-muted-foreground">
                Dernière vérification: aujourd'hui à 08:15
              </div>
              <Button>
                <Check className="mr-2 h-4 w-4" />
                Valider l'inventaire
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
