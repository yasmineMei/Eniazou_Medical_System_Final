import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button, Input, Card, Label, Textarea, Select, Checkbox } from "@/components/ui";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { DossierMedicalPDF } from "@/pdf/dossier-medicalPDF";
import { motion } from "framer-motion";
import { PlusCircle, Edit, Save, X, Pill, ClipboardList, User, SliceIcon, ArrowLeft } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { useState } from "react";
import { patientsData } from "@/data/patients";
import type { Patient } from "@/types/patient";

export const Route = createFileRoute("/_doctor/patientId")({
  component: PatientDetailsPage,
});

function PatientDetailsPage() {
  const { patientId } = Route.useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [newSurgery, setNewSurgery] = useState({ type: "", date: "", notes: "" });
  const [newMedication, setNewMedication] = useState({ 
    nom: "", dosage: "", frequence: "", depuis: "", pour: "" 
  });

  // Trouver le patient
  const patient = patientsData.find(p => p.id === patientId);

  if (!patient) {
    return (
      <div className="flex flex-col min-h-screen p-6 bg-gray-50">
        <Button variant="ghost" onClick={() => navigate({ to: "/patient-doctor" })} className="self-start mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-lg">Patient non trouvé</p>
        </div>
      </div>
    );
  }

  // Gestion des formulaires simplifiée
  const handleChange = (setter: React.Dispatch<React.SetStateAction<any>>) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setter(prev => ({ ...prev, [name]: value }));
    };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Non spécifié";
    return new Date(dateString).toLocaleDateString("fr-FR", { 
      year: "numeric", month: "long", day: "numeric" 
    });
  };

  return (
    <div className="flex flex-col min-h-screen p-6 bg-gray-50">
      <Button variant="ghost" onClick={() => navigate({ to: "/patient-doctor" })} className="self-start mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour à la liste
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[#018a8c]">
          Dossier Médical - {patient.nom} {patient.prenom}
        </h1>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant={isEditing ? "outline" : "default"}
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2"
          >
            {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
            {isEditing ? "Annuler" : "Modifier"}
          </Button>
          
          <PDFDownloadLink
            document={<DossierMedicalPDF patient={patient} />}
            fileName={`dossier_${patient.nom}_${patient.prenom}.pdf`}
          >
            {({ loading }) => (
              <Button variant="secondary" className="flex items-center gap-2" disabled={loading}>
                {loading ? "Génération..." : "Exporter PDF"}
              </Button>
            )}
          </PDFDownloadLink>
        </div>
      </div>

      <Card className="flex-1">
        <CardContent>
          <Tabs defaultValue="informations" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="informations">
                <User className="h-4 w-4 mr-2" />
                Informations
              </TabsTrigger>
              <TabsTrigger value="antecedents">
                <ClipboardList className="h-4 w-4 mr-2" />
                Antécédents
              </TabsTrigger>
              <TabsTrigger value="chirurgies">
                <SliceIcon className="h-4 w-4 mr-2" />
                Chirurgies
              </TabsTrigger>
              <TabsTrigger value="medicaments">
                <Pill className="h-4 w-4 mr-2" />
                Médicaments
              </TabsTrigger>
            </TabsList>

            {/* Onglets simplifiés */}
            <TabsContent value="informations" className="mt-6">
              {/* Contenu simplifié */}
            </TabsContent>

            <TabsContent value="antecedents" className="mt-6">
              {/* Contenu simplifié */}
            </TabsContent>

            <TabsContent value="chirurgies" className="mt-6">
              {/* Contenu simplifié */}
            </TabsContent>

            <TabsContent value="medicaments" className="mt-6">
              {/* Contenu simplifié */}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}