import { createFileRoute } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { OrdonnancePDF } from "@/pdf/ordonnancePDF";
import { Plus, Edit, Trash, Printer } from "lucide-react"; // Icônes de Lucide

export const Route = createFileRoute("/_doctor/ordonnance")({
  component: RouteComponent,
});

// Définir les types pour les ordonnances et les médicaments
type Medicament = {
  nom: string;
  posologie: string;
};

type Ordonnance = {
  id: number;
  patient: string;
  date: string;
  medicaments: Medicament[];
  instructions: string;
};

const AnimatedTableRow = motion(TableRow);

function RouteComponent() {
  const [prescriptions, setPrescriptions] = useState<Ordonnance[]>([
    {
      id: 1,
      patient: "Jean Dupont",
      date: "10/10/2023",
      medicaments: [
        { nom: "Paracétamol", posologie: "500mg, 3 fois par jour" },
        { nom: "Ibuprofène", posologie: "400mg, 2 fois par jour" },
      ],
      instructions: "Prendre après les repas.",
    },
    {
      id: 2,
      patient: "Marie Martin",
      date: "11/10/2023",
      medicaments: [{ nom: "Amoxicilline", posologie: "1g, 2 fois par jour" }],
      instructions: "Prendre avec un grand verre d'eau.",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] =
    useState<Ordonnance | null>(null);
  const [newPrescription, setNewPrescription] = useState<Ordonnance>({
    id: 0,
    patient: "",
    date: "",
    medicaments: [{ nom: "", posologie: "" }],
    instructions: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddPrescription = async () => {
    setIsLoading(true);
    setError("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPrescriptions([
        ...prescriptions,
        {
          id: prescriptions.length + 1,
          ...newPrescription,
        },
      ]);
      setIsModalOpen(false);
      setNewPrescription({
        id: 0,
        patient: "",
        date: "",
        medicaments: [{ nom: "", posologie: "" }],
        instructions: "",
      });
    } catch (err) {
      setError("Une erreur s'est produite lors de l'ajout de l'ordonnance.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePrescription = async () => {
    setIsLoading(true);
    setError("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPrescriptions((prev) =>
        prev.map((p) =>
          p.id === selectedPrescription?.id ? selectedPrescription : p
        )
      );
      setIsModalOpen(false);
      setSelectedPrescription(null);
    } catch (err) {
      setError(
        "Une erreur s'est produite lors de la mise à jour de l'ordonnance."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePrescription = (id: number) => {
    setPrescriptions((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddMedicament = (
    setter: React.Dispatch<React.SetStateAction<Ordonnance>>
  ) => {
    setter((prev) => ({
      ...prev,
      medicaments: [...prev.medicaments, { nom: "", posologie: "" }],
    }));
  };

  const handleMedicamentChange = (
    index: number,
    field: keyof Medicament,
    value: string,
    prescription: Ordonnance,
    setter: React.Dispatch<React.SetStateAction<Ordonnance>>
  ) => {
    const updatedMedicaments = [...prescription.medicaments];
    updatedMedicaments[index][field] = value;
    setter({ ...prescription, medicaments: updatedMedicaments });
  };

  const handleEditPrescription = (prescription: Ordonnance) => {
    setSelectedPrescription(prescription);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col h-screen p-6 bg-gray-50">
      {/* Titre de la page */}
      <h1 className="text-2xl font-bold text-[#018a8c] mb-6">
        Gestion des Ordonnances
      </h1>

      {/* Barre de recherche et filtres */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Rechercher par patient ou date..."
          className="flex-1"
        />
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tous">Toutes</SelectItem>
            <SelectItem value="actives">Actives</SelectItem>
            <SelectItem value="archivees">Archivées</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tableau des ordonnances */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#018a8c]">
            Liste des Ordonnances
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Médicaments</TableHead>
                <TableHead>Instructions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescriptions.map((prescription) => (
                <AnimatedTableRow
                  key={prescription.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <TableCell>{prescription.patient}</TableCell>
                  <TableCell>{prescription.date}</TableCell>
                  <TableCell>
                    <ul className="list-disc list-inside">
                      {prescription.medicaments.map((medicament, index) => (
                        <li key={index}>
                          {medicament.nom} - {medicament.posologie}
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>{prescription.instructions}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {/* Bouton Modifier */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPrescription(prescription)}
                      >
                        <Edit className="h-4 w-4 text-[#018a8c]" />
                      </Button>
                      {/* Bouton Exporter */}
                      <PDFDownloadLink
                        document={<OrdonnancePDF ordonnance={prescription} />}
                        fileName={`ordonnance_${prescription.patient}_${prescription.date}.pdf`}
                      >
                        {({ loading }) => (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={loading}
                          >
                            <Printer className="h-4 w-4 text-[#018a8c]" />
                          </Button>
                        )}
                      </PDFDownloadLink>
                      {/* Bouton Supprimer */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleDeletePrescription(prescription.id)
                        }
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </AnimatedTableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Bouton pour ajouter une nouvelle ordonnance */}
      <div className="mt-6">
        <Button
          className="bg-[#018a8c] hover:bg-[#016a6c]"
          onClick={() => {
            setSelectedPrescription(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" /> Créer une Ordonnance
        </Button>
      </div>

      {/* Modale pour créer ou modifier une ordonnance */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedPrescription
                ? "Modifier l'Ordonnance"
                : "Créer une Ordonnance"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Patient"
              value={
                selectedPrescription
                  ? selectedPrescription.patient
                  : newPrescription.patient
              }
              onChange={(e) =>
                selectedPrescription
                  ? setSelectedPrescription({
                      ...selectedPrescription,
                      patient: e.target.value,
                    })
                  : setNewPrescription({
                      ...newPrescription,
                      patient: e.target.value,
                    })
              }
            />
            <Input
              type="date"
              value={
                selectedPrescription
                  ? selectedPrescription.date
                  : newPrescription.date
              }
              onChange={(e) =>
                selectedPrescription
                  ? setSelectedPrescription({
                      ...selectedPrescription,
                      date: e.target.value,
                    })
                  : setNewPrescription({
                      ...newPrescription,
                      date: e.target.value,
                    })
              }
            />
            {(selectedPrescription
              ? selectedPrescription.medicaments
              : newPrescription.medicaments
            ).map((medicament, index) => (
              <div key={index} className="space-y-2">
                <Input
                  placeholder="Nom du médicament"
                  value={medicament.nom}
                  onChange={(e) =>
                    selectedPrescription
                      ? handleMedicamentChange(
                          index,
                          "nom",
                          e.target.value,
                          selectedPrescription,
                          setSelectedPrescription
                        )
                      : handleMedicamentChange(
                          index,
                          "nom",
                          e.target.value,
                          newPrescription,
                          setNewPrescription
                        )
                  }
                />
                <Input
                  placeholder="Posologie"
                  value={medicament.posologie}
                  onChange={(e) =>
                    selectedPrescription
                      ? handleMedicamentChange(
                          index,
                          "posologie",
                          e.target.value,
                          selectedPrescription,
                          setSelectedPrescription
                        )
                      : handleMedicamentChange(
                          index,
                          "posologie",
                          e.target.value,
                          newPrescription,
                          setNewPrescription
                        )
                  }
                />
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() =>
                handleAddMedicament(
                  selectedPrescription
                    ? setSelectedPrescription
                    : setNewPrescription
                )
              }
            >
              Ajouter un médicament
            </Button>
            <Input
              placeholder="Instructions supplémentaires"
              value={
                selectedPrescription
                  ? selectedPrescription.instructions
                  : newPrescription.instructions
              }
              onChange={(e) =>
                selectedPrescription
                  ? setSelectedPrescription({
                      ...selectedPrescription,
                      instructions: e.target.value,
                    })
                  : setNewPrescription({
                      ...newPrescription,
                      instructions: e.target.value,
                    })
              }
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <DialogFooter>
            <Button
              onClick={
                selectedPrescription
                  ? handleUpdatePrescription
                  : handleAddPrescription
              }
              disabled={isLoading}
            >
              {isLoading
                ? selectedPrescription
                  ? "Mise à jour en cours..."
                  : "Création en cours..."
                : selectedPrescription
                  ? "Mettre à jour"
                  : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Section d'information sur les ordonnances */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-[#018a8c]">
            Informations sur les Ordonnances
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">
            Cette page permet aux médecins de créer, modifier et consulter les
            ordonnances de leurs patients. Les ordonnances peuvent inclure
            plusieurs médicaments avec des posologies spécifiques et des
            instructions supplémentaires.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-gray-700">
            <li>
              📄 Créez des ordonnances personnalisées pour chaque patient.
            </li>
            <li>
              💊 Ajoutez plusieurs médicaments avec des posologies détaillées.
            </li>
            <li>📅 Consultez et archivez les ordonnances passées.</li>
            <li>🔒 Sécurisez les données médicales des patients.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
