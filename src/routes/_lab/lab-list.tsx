import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Printer,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Type pour les analyses
type Analysis = {
  id: string;
  patientName: string;
  patientId: string;
  doctor: string;
  analysisType: "hematology" | "parasitology" | "biochemistry" | "serology";
  status: "pending" | "in-progress" | "completed" | "delivered";
  dateRequested: string;
  dateCompleted?: string;
  origin: "consultation" | "hospitalization";
  details?: {
    medecinPrescripteur: string;
    centre: string;
    datePrelevement: string;
    heurePrelevement: string;
    observations: string;
    [key: string]: any;
  };
};

export const Route = createFileRoute("/_lab/lab-list")({
  component: RouteComponent,
});

function RouteComponent() {
  // Données fictives enrichies
  const mockAnalyses: Analysis[] = [
    {
      id: "LAB-001",
      patientName: "Jean Dupont",
      patientId: "PAT-1234",
      doctor: "Dr. Martin",
      analysisType: "hematology",
      status: "completed",
      dateRequested: "2023-05-15",
      dateCompleted: "2023-05-17",
      origin: "consultation",
      details: {
        medecinPrescripteur: "Dr. Martin",
        centre: "Centre Principal",
        datePrelevement: "2023-05-15",
        heurePrelevement: "09:30",
        observations: "Analyse de routine",
        hematologie: "Hémoglobine: 14 g/dL\nGlobules blancs: 7.5 x10^9/L",
      },
    },
    // ... autres analyses avec détails
  ];

  const [analyses, setAnalyses] = useState<Analysis[]>(mockAnalyses);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [originFilter, setOriginFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const itemsPerPage = 5;

  // Filtrer les analyses
  const filteredAnalyses = analyses.filter((analysis) => {
    const matchesSearch =
      analysis.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      analysis.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      analysis.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      analysis.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || analysis.status === statusFilter;

    const matchesType =
      typeFilter === "all" || analysis.analysisType === typeFilter;

    const matchesOrigin =
      originFilter === "all" || analysis.origin === originFilter;

    return matchesSearch && matchesStatus && matchesType && matchesOrigin;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAnalyses.length / itemsPerPage);
  const paginatedAnalyses = filteredAnalyses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Changer le statut d'une analyse
  const updateAnalysisStatus = (id: string, newStatus: Analysis["status"]) => {
    setAnalyses(
      analyses.map((analysis) =>
        analysis.id === id ? { ...analysis, status: newStatus } : analysis
      )
    );
  };

  // Ouvrir les détails d'une analyse
  const openAnalysisDetails = (analysis: Analysis) => {
    setSelectedAnalysis(analysis);
    setIsDialogOpen(true);
  };

  // Imprimer une analyse
  const printAnalysis = (analysis: Analysis) => {
    const printWindow = window.open("", "", "width=800,height=600");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Résultat d'analyse - ${analysis.id}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #018a8c; text-align: center; }
              .header { margin-bottom: 20px; }
              .section { margin-bottom: 15px; }
              .section-title { 
                font-weight: bold; 
                border-bottom: 1px solid #ddd; 
                padding-bottom: 5px; 
                color: #018a8c;
              }
              .row { display: flex; margin-bottom: 10px; }
              .label { font-weight: bold; width: 200px; }
              .value { flex: 1; }
              .analysis-details { 
                margin-top: 10px; 
                white-space: pre-wrap;
                border: 1px solid #ddd;
                padding: 10px;
                border-radius: 4px;
              }
              @page { size: auto; margin: 10mm; }
            </style>
          </head>
          <body>
            <h1>RÉSULTAT D'ANALYSE MÉDICALE</h1>
            
            <div class="header">
              <div class="row">
                <div class="label">ID Analyse:</div>
                <div class="value">${analysis.id}</div>
              </div>
              <div class="row">
                <div class="label">Date de demande:</div>
                <div class="value">${analysis.dateRequested}</div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">INFORMATIONS PATIENT</div>
              <div class="row">
                <div class="label">Nom:</div>
                <div class="value">${analysis.patientName}</div>
              </div>
              <div class="row">
                <div class="label">ID Patient:</div>
                <div class="value">${analysis.patientId}</div>
              </div>
              <div class="row">
                <div class="label">Médecin:</div>
                <div class="value">${analysis.doctor}</div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">DÉTAILS DE L'ANALYSE</div>
              <div class="row">
                <div class="label">Type:</div>
                <div class="value">${
                  analysis.analysisType === "hematology"
                    ? "Hématologie"
                    : analysis.analysisType === "parasitology"
                      ? "Parasitologie"
                      : analysis.analysisType === "biochemistry"
                        ? "Biochimie"
                        : "Sérologie"
                }</div>
              </div>
              <div class="row">
                <div class="label">Statut:</div>
                <div class="value">${
                  analysis.status === "pending"
                    ? "En attente"
                    : analysis.status === "in-progress"
                      ? "En cours"
                      : analysis.status === "completed"
                        ? "Terminé"
                        : "Rendu"
                }</div>
              </div>
              ${
                analysis.dateCompleted
                  ? `
              <div class="row">
                <div class="label">Date de complétion:</div>
                <div class="value">${analysis.dateCompleted}</div>
              </div>
              `
                  : ""
              }
            </div>

            ${
              analysis.details
                ? `
            <div class="section">
              <div class="section-title">RÉSULTATS</div>
              <div class="analysis-details">
                ${analysis.details[analysis.analysisType] || "Aucun résultat disponible"}
              </div>
            </div>
            `
                : ""
            }

            ${
              analysis.details?.observations
                ? `
            <div class="section">
              <div class="section-title">OBSERVATIONS</div>
              <div class="analysis-details">
                ${analysis.details.observations}
              </div>
            </div>
            `
                : ""
            }
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

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des Analyses</h1>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher par patient, médecin ou ID..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Statut" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="in-progress">En cours</SelectItem>
              <SelectItem value="completed">Terminé</SelectItem>
              <SelectItem value="delivered">Rendu</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Type d'analyse" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="hematology">Hématologie</SelectItem>
              <SelectItem value="parasitology">Parasitologie</SelectItem>
              <SelectItem value="biochemistry">Biochimie</SelectItem>
              <SelectItem value="serology">Sérologie</SelectItem>
            </SelectContent>
          </Select>

          <Select value={originFilter} onValueChange={setOriginFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Origine" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes origines</SelectItem>
              <SelectItem value="consultation">Consultation</SelectItem>
              <SelectItem value="hospitalization">Hospitalisation</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tableau des analyses */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Analyse</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Médecin</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date demande</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAnalyses.length > 0 ? (
              paginatedAnalyses.map((analysis) => (
                <TableRow key={analysis.id}>
                  <TableCell className="font-medium">{analysis.id}</TableCell>
                  <TableCell>{analysis.patientName}</TableCell>
                  <TableCell>{analysis.doctor}</TableCell>
                  <TableCell>
                    {analysis.analysisType === "hematology" && "Hématologie"}
                    {analysis.analysisType === "parasitology" &&
                      "Parasitologie"}
                    {analysis.analysisType === "biochemistry" && "Biochimie"}
                    {analysis.analysisType === "serology" && "Sérologie"}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={analysis.status}
                      onValueChange={(value) =>
                        updateAnalysisStatus(
                          analysis.id,
                          value as Analysis["status"]
                        )
                      }
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="in-progress">En cours</SelectItem>
                        <SelectItem value="completed">Terminé</SelectItem>
                        <SelectItem value="delivered">Rendu</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{analysis.dateRequested}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openAnalysisDetails(analysis)}
                      >
                        Détails
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => printAnalysis(analysis)}
                      >
                        Imprimer
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Aucune analyse trouvée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Affichage de {paginatedAnalyses.length} analyses sur{" "}
            {filteredAnalyses.length}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Dialog pour les détails */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Détails de l'analyse {selectedAnalysis?.id}
            </DialogTitle>
          </DialogHeader>
          {selectedAnalysis && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-500">Patient</h3>
                  <p>{selectedAnalysis.patientName}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">ID Patient</h3>
                  <p>{selectedAnalysis.patientId}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Médecin</h3>
                  <p>{selectedAnalysis.doctor}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Type d'analyse</h3>
                  <p>
                    {selectedAnalysis.analysisType === "hematology" &&
                      "Hématologie"}
                    {selectedAnalysis.analysisType === "parasitology" &&
                      "Parasitologie"}
                    {selectedAnalysis.analysisType === "biochemistry" &&
                      "Biochimie"}
                    {selectedAnalysis.analysisType === "serology" &&
                      "Sérologie"}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Date de demande</h3>
                  <p>{selectedAnalysis.dateRequested}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Statut</h3>
                  <p>
                    {selectedAnalysis.status === "pending" && "En attente"}
                    {selectedAnalysis.status === "in-progress" && "En cours"}
                    {selectedAnalysis.status === "completed" && "Terminé"}
                    {selectedAnalysis.status === "delivered" && "Rendu"}
                  </p>
                </div>
              </div>

              {selectedAnalysis.details && (
                <>
                  <div>
                    <h3 className="font-medium text-gray-500">Résultats</h3>
                    <div className="bg-gray-50 p-3 rounded mt-2 whitespace-pre-wrap">
                      {selectedAnalysis.details[
                        selectedAnalysis.analysisType
                      ] || "Aucun résultat disponible"}
                    </div>
                  </div>

                  {selectedAnalysis.details.observations && (
                    <div>
                      <h3 className="font-medium text-gray-500">
                        Observations
                      </h3>
                      <p className="bg-gray-50 p-3 rounded mt-2">
                        {selectedAnalysis.details.observations}
                      </p>
                    </div>
                  )}
                </>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => printAnalysis(selectedAnalysis)}
                >
                  Imprimer
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>Fermer</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
