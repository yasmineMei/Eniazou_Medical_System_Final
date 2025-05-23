import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "@tanstack/react-router";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const Route = createFileRoute("/_lab/opd-request")({
  component: OpdRequestPage,
});

function OpdRequestPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    medecinPrescripteur: "",
    centre: "",
    datePrelevement: "",
    heurePrelevement: "",
    dateEdition: "",
    nomPatient: "",
    age: "",
    sexe: "",
    numeroEnregistrement: "",
    typeAnalyse: "",
    hematologie: "",
    parasitologie: "",
    biochimie: "",
    serologie: "",
    observations: "",
  });
  const [status, setStatus] = useState<{
    type: "idle" | "error" | "success";
    message: string;
  }>({ type: "idle", message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAddToLabList = () => {
    // Validation des champs requis
    if (
      !formData.nomPatient ||
      !formData.typeAnalyse ||
      !formData.medecinPrescripteur
    ) {
      setStatus({
        type: "error",
        message: "Veuillez remplir tous les champs obligatoires",
      });
      return;
    }

    // Simulation d'enregistrement
    const newAnalysis = {
      id: `LAB-${Math.floor(Math.random() * 10000)}`,
      patientName: formData.nomPatient,
      patientId: formData.numeroEnregistrement,
      doctor: formData.medecinPrescripteur,
      analysisType: formData.typeAnalyse as
        | "hematology"
        | "parasitology"
        | "biochemistry"
        | "serology",
      status: "pending" as const,
      dateRequested: new Date().toISOString().split("T")[0],
      origin: "consultation" as const,
      details: { ...formData },
    };

    console.log("Nouvelle analyse ajoutée:", newAnalysis);

    setStatus({
      type: "success",
      message: "La demande d'analyse a été ajoutée à la liste",
    });

    // Réinitialisation après 2 secondes
    setTimeout(() => {
      setStatus({ type: "idle", message: "" });
      // Redirection vers la liste des analyses
      router.navigate({ to: "/lab-list" });
    }, 2000);
  };

  return (
    <div className="p-4 space-y-6 print:p-0">
      {status.type === "error" && (
        <Alert variant="destructive">
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      )}
      {status.type === "success" && (
        <Alert>
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Demande Consultation</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            Imprimer
          </Button>
          <Button
            onClick={handleAddToLabList}
            className="bg-[#018a8c] hover:bg-[#016a6c]"
          >
            Ajouter à la liste des analyses
          </Button>
        </div>
      </div>

      {/* ... (le reste du formulaire reste inchangé) ... */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Section informations de base */}
        <div className="space-y-4 p-4 border rounded-lg">
          <h3 className="font-medium">Informations de la demande</h3>
          <div className="grid gap-2">
            <Label>Médecin prescripteur *</Label>
            <Input
              name="medecinPrescripteur"
              value={formData.medecinPrescripteur}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Centre *</Label>
            <Input
              name="centre"
              value={formData.centre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Prélèvement le *</Label>
              <Input
                type="date"
                name="datePrelevement"
                value={formData.datePrelevement}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Heure *</Label>
              <Input
                type="time"
                name="heurePrelevement"
                value={formData.heurePrelevement}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Dossier édité le *</Label>
            <Input
              type="date"
              name="dateEdition"
              value={formData.dateEdition}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Section informations patient */}
        <div className="space-y-4 p-4 border rounded-lg">
          <h3 className="font-medium">Informations patient</h3>
          <div className="grid gap-2">
            <Label>Nom patient *</Label>
            <Input
              name="nomPatient"
              value={formData.nomPatient}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Âge *</Label>
              <Input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Sexe *</Label>
              <Select
                value={formData.sexe}
                onValueChange={(value) => handleSelectChange("sexe", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculin</SelectItem>
                  <SelectItem value="F">Féminin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>N° enregistrement *</Label>
            <Input
              name="numeroEnregistrement"
              value={formData.numeroEnregistrement}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      {/* Section analyses */}
      <div className="space-y-4 p-4 border rounded-lg">
        <h3 className="font-medium">Analyses demandées *</h3>
        <div className="grid gap-4">
          <Select
            value={formData.typeAnalyse}
            onValueChange={(value) => handleSelectChange("typeAnalyse", value)}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner le type d'analyse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hematologie">Hématologie</SelectItem>
              <SelectItem value="parasitologie">
                Parasitologie sanguine
              </SelectItem>
              <SelectItem value="biochimie">Biochimie sanguine</SelectItem>
              <SelectItem value="serologie">Sérologie bactérienne</SelectItem>
            </SelectContent>
          </Select>

          {formData.typeAnalyse === "hematologie" && (
            <div className="grid gap-4">
              <Label>
                Hématologie (Formule Globulaire et Formule Leucocytaire) *
              </Label>
              <Textarea
                name="hematologie"
                value={formData.hematologie}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>
          )}

          {formData.typeAnalyse === "parasitologie" && (
            <div className="grid gap-4">
              <Label>Parasitologie sanguine *</Label>
              <Textarea
                name="parasitologie"
                value={formData.parasitologie}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>
          )}

          {formData.typeAnalyse === "biochimie" && (
            <div className="grid gap-4">
              <Label>Biochimie sanguine *</Label>
              <Textarea
                name="biochimie"
                value={formData.biochimie}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>
          )}

          {formData.typeAnalyse === "serologie" && (
            <div className="grid gap-4">
              <Label>Sérologie bactérienne *</Label>
              <Textarea
                name="serologie"
                value={formData.serologie}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>
          )}
        </div>
      </div>

      {/* Observations */}
      <div className="space-y-4 p-4 border rounded-lg">
        <Label>Observations</Label>
        <Textarea
          name="observations"
          value={formData.observations}
          onChange={handleChange}
          rows={4}
          placeholder="Notes supplémentaires pour le laboratoire..."
        />
      </div>
    </div>
  );
}
