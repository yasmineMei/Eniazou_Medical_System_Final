import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
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

export const Route = createFileRoute("/_lab/txt")({
  component: OpdRequestPage,
});

function OpdRequestPage() {
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);
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
    const printWindow = window.open("", "", "width=800,height=600");
    if (printWindow && printRef.current) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Demande d'analyse médicale</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #018a8c; text-align: center; }
              .header { margin-bottom: 20px; }
              .section { margin-bottom: 15px; }
              .section-title { font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
              .row { display: flex; margin-bottom: 10px; }
              .label { font-weight: bold; width: 200px; }
              .value { flex: 1; }
              .analysis-details { margin-top: 10px; white-space: pre-wrap; }
              .footer { margin-top: 30px; text-align: right; font-style: italic; }
              @page { size: auto; margin: 10mm; }
            </style>
          </head>
          <body>
            <h1>Demande d'analyse médicale</h1>
            <div class="header">
              <div class="row">
                <div class="label">Date d'édition:</div>
                <div class="value">${formData.dateEdition}</div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Informations de la demande</div>
              <div class="row">
                <div class="label">Médecin prescripteur:</div>
                <div class="value">${formData.medecinPrescripteur}</div>
              </div>
              <div class="row">
                <div class="label">Centre:</div>
                <div class="value">${formData.centre}</div>
              </div>
              <div class="row">
                <div class="label">Date de prélèvement:</div>
                <div class="value">${formData.datePrelevement} à ${formData.heurePrelevement}</div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Informations patient</div>
              <div class="row">
                <div class="label">Nom patient:</div>
                <div class="value">${formData.nomPatient}</div>
              </div>
              <div class="row">
                <div class="label">Âge/Sexe:</div>
                <div class="value">${formData.age} ans / ${formData.sexe === "M" ? "Masculin" : "Féminin"}</div>
              </div>
              <div class="row">
                <div class="label">N° enregistrement:</div>
                <div class="value">${formData.numeroEnregistrement}</div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Analyses demandées</div>
              <div class="row">
                <div class="label">Type d'analyse:</div>
                <div class="value">${
                  formData.typeAnalyse === "hematologie"
                    ? "Hématologie"
                    : formData.typeAnalyse === "parasitologie"
                      ? "Parasitologie sanguine"
                      : formData.typeAnalyse === "biochimie"
                        ? "Biochimie sanguine"
                        : "Sérologie bactérienne"
                }</div>
              </div>
              <div class="analysis-details">
                ${formData[formData.typeAnalyse as keyof typeof formData] || "Aucun détail fourni"}
              </div>
            </div>

            ${
              formData.observations
                ? `
            <div class="section">
              <div class="section-title">Observations</div>
              <div class="analysis-details">
                ${formData.observations}
              </div>
            </div>
            `
                : ""
            }

            <div class="footer">
              Document généré le ${new Date().toLocaleDateString()}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
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
    <div className="p-4 space-y-6" ref={printRef}>
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

      <div className="flex justify-between items-center print:hidden">
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

      {/* Contenu du formulaire */}
      <div className="print:block">
        {/* ... (le reste du formulaire reste inchangé) ... */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Section informations de base */}
          <div className="space-y-4 p-4 border rounded-lg print:border-none print:p-0">
            <h3 className="font-medium print:text-lg">
              Informations de la demande
            </h3>
            <div className="grid gap-2">
              <Label className="print:font-bold">Médecin prescripteur *</Label>
              <Input
                name="medecinPrescripteur"
                value={formData.medecinPrescripteur}
                onChange={handleChange}
                required
                className="print:border-none print:p-0 print:shadow-none"
              />
            </div>

            {/* ... (autres champs avec classes print) ... */}
          </div>
        </div>
      </div>
    </div>
  );
}
