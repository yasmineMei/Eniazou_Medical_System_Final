import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from "jspdf";
import {
  Download,
  Printer,
  FileText,
  User,
  Calendar,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_nurse/report-nurse")({
  component: ReportComponent,
});

interface Patient {
  id: string;
  name: string;
  room: string;
}

interface ShiftOption {
  value: string;
  label: string;
}

interface Report {
  id: string;
  patient: string;
  date: string;
  time: string;
  shift: string | undefined;
  content: string;
}

const patients: Patient[] = [
  { id: "P-1001", name: "Marie Dupont", room: "204" },
  { id: "P-1002", name: "Jean Martin", room: "105" },
  { id: "P-1003", name: "Sophie Lambert", room: "302" },
];

const shiftOptions: ShiftOption[] = [
  { value: "morning", label: "Matin (6h-14h)" },
  { value: "afternoon", label: "Après-midi (14h-22h)" },
  { value: "night", label: "Nuit (22h-6h)" },
];

function ReportComponent() {
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [shift, setShift] = useState<string>("morning");
  const [reportContent, setReportContent] = useState<string>("");
  const [reports, setReports] = useState<Report[]>([]);
  const printRef = useRef<HTMLDivElement>(null);

  const handleGenerateReport = () => {
    const newReport: Report = {
      id: `RPT-${Date.now()}`,
      patient:
        patients.find((p) => p.id === selectedPatient)?.name ||
        "Tous les patients",
      date: new Date().toLocaleDateString("fr-FR"),
      time: new Date().toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      shift: shiftOptions.find((s) => s.value === shift)?.label,
      content: reportContent,
    };
    setReports((prev) => [newReport, ...prev]);
    setReportContent("");
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: `
      @page { size: A4; margin: 10mm; }
      body { -webkit-print-color-adjust: exact; }
    `,
    documentTitle: `Rapport-Infirmier-${new Date().toISOString().slice(0, 10)}`,
  });

  const exportToPDF = async () => {
    if (!printRef.current) return;

    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(printRef.current);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(
        `rapport-infirmier-${new Date().toISOString().slice(0, 10)}.pdf`
      );
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Rapports Infirmiers
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToPDF}>
            <Download className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Nouveau rapport</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Patient</Label>
              <Select
                value={selectedPatient}
                onValueChange={setSelectedPatient}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un patient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les patients</SelectItem>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name} (Ch. {patient.room})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Shift</Label>
              <Select value={shift} onValueChange={setShift}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un shift" />
                </SelectTrigger>
                <SelectContent>
                  {shiftOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Observations</Label>
              <Textarea
                value={reportContent}
                onChange={(e) => setReportContent(e.target.value)}
                placeholder="Rédigez votre rapport ici..."
                className="min-h-[200px]"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t px-6 py-3">
            <Button onClick={handleGenerateReport}>Générer le rapport</Button>
          </CardFooter>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Aperçu du rapport</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                ref={printRef}
                className="border rounded-lg p-4 whitespace-pre-wrap"
              >
                <h2 className="text-xl font-bold mb-2">
                  Rapport Infirmier -{" "}
                  {shiftOptions.find((s) => s.value === shift)?.label}
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date().toLocaleDateString("fr-FR")}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {new Date().toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  {selectedPatient && selectedPatient !== "all" && (
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {patients.find((p) => p.id === selectedPatient)?.name}
                    </div>
                  )}
                </div>
                <div>{reportContent || "Aucun contenu saisi"}</div>
              </div>
            </CardContent>
          </Card>

          {reports.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Historique des rapports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="rounded-lg border p-4 hover:bg-muted/50"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{report.patient}</h3>
                      <div className="text-sm text-muted-foreground">
                        {report.date} • {report.time}
                      </div>
                    </div>
                    <div className="mt-2 text-sm whitespace-pre-wrap line-clamp-3">
                      {report.content}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={() => setReportContent(report.content)}
                    >
                      Réutiliser ce rapport
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
