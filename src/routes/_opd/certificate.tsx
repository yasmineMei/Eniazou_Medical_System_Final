import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { Search, User, Phone, MapPin, Calendar, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Solution pour l'erreur findDOMNode avec ReactQuill
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <div className="h-64 flex items-center justify-center">
      <div className="animate-pulse flex space-x-4">
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  ),
});

export const Route = createFileRoute("/_opd/certificate")({
  component: CertificateComponent,
});

type Patient = {
  id: string;
  uhid: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  address: string;
};

type CertificateType =
  | "birth"
  | "death"
  | "medical"
  | "blood-request"
  | "general"
  | "fitness";

function CertificateComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [certificateText, setCertificateText] = useState("");
  const [activeCertificate, setActiveCertificate] =
    useState<CertificateType | null>(null);
  const quillRef = useRef(null);

  // Données simulées des patients
  const patients: Patient[] = [
    {
      id: "1",
      uhid: "UHID-2023-001",
      name: "Jean Dupont",
      age: 32,
      gender: "Masculin",
      phone: "06 12 34 56 78",
      address: "12 Rue de Paris, 75001",
    },
    {
      id: "2",
      uhid: "UHID-2023-002",
      name: "Marie Lambert",
      age: 28,
      gender: "Féminin",
      phone: "07 23 45 67 89",
      address: "34 Avenue des Champs, 75008",
    },
    {
      id: "3",
      uhid: "UHID-2023-003",
      name: "Pierre Martin",
      age: 45,
      gender: "Masculin",
      phone: "06 98 76 54 32",
      address: "56 Boulevard Saint-Germain, 75006",
    },
  ];

  // Filtrage des patients
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.uhid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm)
  );

  // Modèles de certificats prédéfinis
  const certificateTemplates: Record<CertificateType, string> = {
    birth: `<h2 class="text-center font-bold text-xl mb-4" style="color: #018a8c;">CERTIFICAT DE NAISSANCE</h2>
            <p class="mb-4">Je soussigné(e), Dr. [Nom du médecin], certifie que <strong>${selectedPatient?.name || "[Nom du patient]"}</strong> est né(e) le [Date de naissance] à [Lieu de naissance].</p>
            <div class="flex justify-between mt-8">
              <div>
                <p>Le [Date]</p>
                <p class="mt-8">Signature et cachet</p>
              </div>
              <div class="text-right">
                <p>À [Ville], le [Date]</p>
              </div>
            </div>`,

    death: `<h2 class="text-center font-bold text-xl mb-4" style="color: #018a8c;">CERTIFICAT DE DÉCÈS</h2>
            <p class="mb-4">Je soussigné(e), Dr. [Nom du médecin], certifie que <strong>${selectedPatient?.name || "[Nom du patient]"}</strong> (${selectedPatient?.age || "[Age]"} ans) est décédé(e) le [Date de décès] à [Heure de décès] des suites de [Cause du décès].</p>
            <div class="flex justify-between mt-8">
              <div>
                <p>Le [Date]</p>
                <p class="mt-8">Signature et cachet</p>
              </div>
              <div class="text-right">
                <p>À [Ville], le [Date]</p>
              </div>
            </div>`,

    medical: `<h2 class="text-center font-bold text-xl mb-4" style="color: #018a8c;">CERTIFICAT MÉDICAL</h2>
              <p class="mb-2">Je soussigné(e), Dr. [Nom du médecin], certifie avoir examiné ce jour:</p>
              <div class="ml-4 mb-4">
                <p><strong>Nom:</strong> ${selectedPatient?.name || "[Nom du patient]"}</p>
                <p><strong>Âge:</strong> ${selectedPatient?.age || "[Age]"} ans</p>
                <p><strong>UHID:</strong> ${selectedPatient?.uhid || "[UHID]"}</p>
              </div>
              <p class="mb-2"><strong>Diagnostic:</strong> [Diagnostic]</p>
              <p class="mb-2"><strong>Traitement prescrit:</strong> [Traitement]</p>
              <p class="mb-4"><strong>Durée d'arrêt de travail:</strong> [Durée] jours</p>
              <div class="flex justify-between mt-8">
                <div>
                  <p>Le [Date]</p>
                  <p class="mt-8">Signature et cachet</p>
                </div>
                <div class="text-right">
                  <p>À [Ville], le [Date]</p>
                </div>
              </div>`,

    "blood-request": `<h2 class="text-center font-bold text-xl mb-4" style="color: #018a8c;">DEMANDE DE SANG</h2>
                      <p class="mb-4">Je soussigné(e), Dr. [Nom du médecin], demande [Quantité] unités de sang de type [Groupe sanguin] pour:</p>
                      <div class="ml-4 mb-4">
                        <p><strong>Nom:</strong> ${selectedPatient?.name || "[Nom du patient]"}</p>
                        <p><strong>Âge:</strong> ${selectedPatient?.age || "[Age]"} ans</p>
                        <p><strong>UHID:</strong> ${selectedPatient?.uhid || "[UHID]"}</p>
                        <p><strong>Service:</strong> [Service]</p>
                      </div>
                      <p class="mb-4"><strong>Motif:</strong> [Motif de la demande]</p>
                      <div class="flex justify-between mt-8">
                        <div>
                          <p>Le [Date]</p>
                          <p class="mt-8">Signature et cachet</p>
                        </div>
                        <div class="text-right">
                          <p>À [Ville], le [Date]</p>
                        </div>
                      </div>`,

    general: `<h2 class="text-center font-bold text-xl mb-4" style="color: #018a8c;">CERTIFICAT MÉDICAL GÉNÉRAL</h2>
              <p class="mb-4">Je soussigné(e), Dr. [Nom du médecin], certifie que <strong>${selectedPatient?.name || "[Nom du patient]"}</strong>, âgé(e) de ${selectedPatient?.age || "[Age]"} ans, a été examiné(e) ce jour et est dans l'état de santé suivant: [Description].</p>
              <div class="flex justify-between mt-8">
                <div>
                  <p>Le [Date]</p>
                  <p class="mt-8">Signature et cachet</p>
                </div>
                <div class="text-right">
                  <p>À [Ville], le [Date]</p>
                </div>
              </div>`,

    fitness: `<h2 class="text-center font-bold text-xl mb-4" style="color: #018a8c;">CERTIFICAT D'APTITUDE</h2>
              <p class="mb-4">Je soussigné(e), Dr. [Nom du médecin], certifie que <strong>${selectedPatient?.name || "[Nom du patient]"}</strong>, âgé(e) de ${selectedPatient?.age || "[Age]"} ans, est médicalement apte à [Activité concernée].</p>
              <p class="mb-4"><strong>Ce certificat est valable jusqu'au:</strong> [Date de fin de validité]</p>
              <div class="flex justify-between mt-8">
                <div>
                  <p>Le [Date]</p>
                  <p class="mt-8">Signature et cachet</p>
                </div>
                <div class="text-right">
                  <p>À [Ville], le [Date]</p>
                </div>
              </div>`,
  };

  const handleCertificateSelect = (type: CertificateType) => {
    setActiveCertificate(type);
    if (selectedPatient) {
      const template = certificateTemplates[type]
        .replace(/\[Nom du patient\]/g, selectedPatient.name)
        .replace(/\[Age\]/g, selectedPatient.age.toString())
        .replace(/\[UHID\]/g, selectedPatient.uhid);
      setCertificateText(template);
    } else {
      setCertificateText(certificateTemplates[type]);
    }
  };

  const handlePrintCertificate = () => {
    const printWindow = window.open("", "", "width=800,height=600");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Certificat Médical</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .clinic-name { font-size: 24px; font-weight: bold; color: #018a8c; }
              .clinic-address { font-size: 14px; color: #666; }
              .content { margin: 40px 0; }
              .footer { margin-top: 60px; display: flex; justify-content: space-between; }
              .signature { margin-top: 80px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="clinic-name">Clinique Médicale Eniazou</div>
              <div class="clinic-address">Abidjan, Yopougon Selmer, Côte d'ivoire</div>
            </div>
            <div class="content">
              ${certificateText}
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

  const getGenderIcon = (gender: string) => {
    return gender === "Féminin" ? (
      <span className="text-pink-500">♀</span>
    ) : (
      <span className="text-blue-500">♂</span>
    );
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* En-tête avec la couleur de la clinique */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#018a8c]">
            Gestion des Certificats
          </h1>
          <p className="text-muted-foreground">
            Générez et imprimez des certificats médicaux
          </p>
        </div>
        <div className="bg-[#018a8c] text-white p-3 rounded-lg shadow">
          <Calendar className="h-6 w-6" />
        </div>
      </div>

      {/* Barre de recherche améliorée */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-[#018a8c]" />
        </div>
        <Input
          placeholder="Rechercher un patient (nom, UHID ou téléphone)..."
          className="pl-10 py-5 text-md border-2 border-gray-200 focus:border-[#018a8c] focus-visible:ring-[#018a8c]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Section principale */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne des patients */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <h2 className="text-lg font-semibold text-[#018a8c] mb-4">
              Liste des Patients
            </h2>

            {filteredPatients.length > 0 ? (
              <div className="space-y-3">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedPatient?.id === patient.id
                        ? "border-[#018a8c] bg-[#018a8c]/10"
                        : "border-gray-200 hover:border-[#018a8c]/50 hover:bg-[#018a8c]/5"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium flex items-center gap-2">
                          {patient.name}
                          {getGenderIcon(patient.gender)}
                          {selectedPatient?.id === patient.id && (
                            <Badge className="bg-[#018a8c] text-white">
                              Sélectionné
                            </Badge>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {patient.uhid}
                        </p>
                      </div>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        {patient.age} ans
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-[#018a8c]" />
                      <span>{patient.phone}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="mx-auto h-8 w-8 mb-2" />
                <p>Aucun patient trouvé</p>
              </div>
            )}
          </div>

          {/* Types de certificats */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <h2 className="text-lg font-semibold text-[#018a8c] mb-4">
              Types de Certificats
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <CertificateTypeButton
                type="birth"
                active={activeCertificate === "birth"}
                onClick={handleCertificateSelect}
                color="#018a8c"
              >
                Naissance
              </CertificateTypeButton>
              <CertificateTypeButton
                type="death"
                active={activeCertificate === "death"}
                onClick={handleCertificateSelect}
                color="#018a8c"
              >
                Décès
              </CertificateTypeButton>
              <CertificateTypeButton
                type="medical"
                active={activeCertificate === "medical"}
                onClick={handleCertificateSelect}
                color="#018a8c"
              >
                Médical
              </CertificateTypeButton>
              <CertificateTypeButton
                type="blood-request"
                active={activeCertificate === "blood-request"}
                onClick={handleCertificateSelect}
                color="#018a8c"
              >
                Demande sang
              </CertificateTypeButton>
              <CertificateTypeButton
                type="general"
                active={activeCertificate === "general"}
                onClick={handleCertificateSelect}
                color="#018a8c"
              >
                Général
              </CertificateTypeButton>
              <CertificateTypeButton
                type="fitness"
                active={activeCertificate === "fitness"}
                onClick={handleCertificateSelect}
                color="#018a8c"
              >
                Aptitude
              </CertificateTypeButton>
            </div>
          </div>
        </div>

        {/* Zone d'édition du certificat */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            {selectedPatient ? (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="bg-[#018a8c] p-2 rounded-full text-white">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">
                      {selectedPatient.name}
                    </h3>
                    <div className="flex gap-2 items-center text-sm text-muted-foreground">
                      <span>UHID: {selectedPatient.uhid}</span>
                      <span>•</span>
                      <span>{selectedPatient.age} ans</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        {getGenderIcon(selectedPatient.gender)}
                        {selectedPatient.gender}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-[#018a8c]" />
                    <span>{selectedPatient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-[#018a8c]" />
                    <span className="truncate">{selectedPatient.address}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <User className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-600">
                  Aucun patient sélectionné
                </h3>
                <p className="text-muted-foreground">
                  Veuillez sélectionner un patient pour générer un certificat
                </p>
              </div>
            )}

            {activeCertificate ? (
              <>
                <h2 className="text-xl font-bold mb-4 text-[#018a8c] border-b pb-2">
                  {getCertificateName(activeCertificate)}
                </h2>

                <ReactQuill
                  theme="snow"
                  value={certificateText}
                  onChange={setCertificateText}
                  className="h-96 mb-6 border-gray-200 rounded-lg"
                  ref={quillRef}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ["bold", "italic", "underline", "strike"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link"],
                      ["clean"],
                      [{ color: [] }, { background: [] }],
                      [{ align: [] }],
                    ],
                  }}
                  formats={[
                    "header",
                    "bold",
                    "italic",
                    "underline",
                    "strike",
                    "list",
                    "bullet",
                    "link",
                    "color",
                    "background",
                    "align",
                  ]}
                />

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    className="border-gray-300"
                    onClick={() => {
                      setCertificateText("");
                      setActiveCertificate(null);
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handlePrintCertificate}
                    className="bg-[#018a8c] hover:bg-[#017a7c]"
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimer le certificat
                  </Button>
                </div>
              </>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-muted-foreground bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <FileText className="h-10 w-10 mb-3 text-gray-400" />
                <h3 className="text-lg font-medium">
                  Aucun certificat sélectionné
                </h3>
                <p className="text-sm">
                  Veuillez sélectionner un type de certificat
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant pour les boutons de type de certificat
function CertificateTypeButton({
  type,
  active,
  onClick,
  color,
  children,
}: {
  type: CertificateType;
  active: boolean;
  onClick: (type: CertificateType) => void;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={() => onClick(type)}
      className={`p-3 rounded-lg border transition-all duration-200 flex items-center justify-center text-sm font-medium ${
        active
          ? `border-[${color}] bg-[${color}] text-white`
          : `border-gray-200 hover:border-[${color}]/50 hover:bg-[${color}]/5 text-gray-700`
      }`}
      style={active ? { backgroundColor: color, borderColor: color } : {}}
    >
      {children}
    </button>
  );
}

// Fonction utilitaire pour obtenir le nom complet du certificat
function getCertificateName(type: CertificateType): string {
  const names = {
    birth: "Certificat de naissance",
    death: "Certificat de décès",
    medical: "Certificat médical",
    "blood-request": "Demande de sang",
    general: "Certificat général",
    fitness: "Certificat d'aptitude",
  };
  return names[type];
}

// Composant d'icône de fichier (remplacement pour FileText de lucide-react)
const FileText = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" x2="8" y1="13" y2="13" />
    <line x1="16" x2="8" y1="17" y2="17" />
    <line x1="10" x2="8" y1="9" y2="9" />
  </svg>
);
