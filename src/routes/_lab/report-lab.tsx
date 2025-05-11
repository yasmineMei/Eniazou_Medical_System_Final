// src/routes/_lab/report.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_lab/report-lab")({
  component: ReportPage,
});

function ReportPage() {
  const [report, setReport] = useState({
    title: "",
    date: "",
    content: "",
    conclusion: "",
    technician: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setReport((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 space-y-6 print:p-0">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Rapport Laboratoire</h2>
        <Button onClick={handlePrint}>Imprimer</Button>
      </div>

      <div className="space-y-4 p-4 border rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Titre du rapport</Label>
            <Input name="title" value={report.title} onChange={handleChange} />
          </div>
          <div className="grid gap-2">
            <Label>Date</Label>
            <Input
              type="date"
              name="date"
              value={report.date}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label>Technicien</Label>
          <Input
            name="technician"
            value={report.technician}
            onChange={handleChange}
          />
        </div>

        <div className="grid gap-2">
          <Label>Contenu du rapport</Label>
          <Textarea
            name="content"
            value={report.content}
            onChange={handleChange}
            rows={8}
          />
        </div>

        <div className="grid gap-2">
          <Label>Conclusion</Label>
          <Textarea
            name="conclusion"
            value={report.conclusion}
            onChange={handleChange}
            rows={4}
          />
        </div>
      </div>
    </div>
  );
}
