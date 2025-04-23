"use client";

import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Search,
  User,
  Phone,
  MapPin,
  Calendar,
  Printer,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import logo from "@/images/logo.png";

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

type CertificateData = {
  doctorName: string;
  date: string;
  place: string;
  additionalInfo: string;
  diagnostic?: string;
  treatment?: string;
  duration?: string;
  cause?: string;
  bloodType?: string;
  quantity?: string;
  service?: string;
  activity?: string;
  validity?: string;
  birthHour?: string;
  deathHour?: string;
  nameMother?: string;
  birthMother?: string;
  childGender?: string;
};

function CertificateComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [activeCertificate, setActiveCertificate] =
    useState<CertificateType | null>(null);
  const [isEditing, setIsEditing] = useState(true);
  const [certificateData, setCertificateData] = useState<CertificateData>({
    doctorName: "Dr. Konan Kouakou",
    date: new Date().toISOString().split("T")[0],
    place: "Abidjan",
    additionalInfo: "",
  });

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

  const handleCertificateSelect = (type: CertificateType) => {
    setActiveCertificate(type);
    setIsEditing(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setCertificateData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateCertificateContent = () => {
    if (!activeCertificate || !selectedPatient) return "";

    const {
      doctorName,
      date,
      place,
      additionalInfo,
      diagnostic,
      treatment,
      duration,
      cause,
      bloodType,
      quantity,
      service,
      activity,
      validity,
      birthHour,
      deathHour,
      nameMother,
      birthMother,
      childGender,
    } = certificateData;

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("fr-FR");
    };

    const templates = {
      birth: `
        <h2 class="text-center font-bold text-xl mb-4" style="color: #018a8c;">CERTIFICAT DE NAISSANCE</h2>
        <p class="mb-2">Je soussigné(e), ${doctorName}, membre du personnel médical de l'établissement susmentionné, certifie que :</p>
        
        <div class="ml-4 mb-4">
          <p><strong>Enfant:</strong> ${selectedPatient.name}</p>
          <p><strong>Sexe:</strong> ${childGender || "[Non spécifié]"}</p>
          <p><strong>Né(e) le:</strong> ${formatDate(date)} à ${birthHour || "[Heure non spécifiée]"} à ${place}</p>
          <p><strong>Mère:</strong> ${nameMother || "[Nom non spécifié]"} ${birthMother ? `(née le ${formatDate(birthMother)})` : ""}</p>
        </div>
        
        ${additionalInfo ? `<p class="mb-4">${additionalInfo}</p>` : ""}
        
        <p class="mt-8">né(e) vivant(e) et viable, sous contrôle médical et conformément aux protocoles en vigueur.</p>
        <div class="flex justify-between mt-8">
          <div>
            <p>Le ${formatDate(date)}</p>
            <p class="mt-8">Signature et cachet</p>
          </div>
          <div class="text-right">
            <p>À ${place}, le ${formatDate(date)}</p>
          </div>
        </div>
      `,
      death: `
        <h2 class="text-center font-bold text-xl mb-4" style="color: #018a8c;">CERTIFICAT DE DÉCÈS</h2>
        <p class="mb-4">Je soussigné(e), ${doctorName}, certifie que <strong>${selectedPatient.name}</strong> (${selectedPatient.age} ans) est décédé(e) le ${formatDate(date)} à ${deathHour || "[Heure non spécifiée]"} des suites de ${cause || "[Cause du décès]"}.</p>
        ${additionalInfo ? `<p class="mb-4">${additionalInfo}</p>` : ""}
        <div class="flex justify-between mt-8">
          <div>
            <p>Le ${formatDate(date)}</p>
            <p class="mt-8">Signature et cachet</p>
          </div>
          <div class="text-right">
            <p>À ${place}, le ${formatDate(date)}</p>
          </div>
        </div>
      `,
      medical: `
        <h2 class="text-center font-bold text-xl mb-4" style="color: #018a8c;">CERTIFICAT MÉDICAL</h2>
        <p class="mb-2">Je soussigné(e), ${doctorName}, certifie avoir examiné ce jour:</p>
        <div class="ml-4 mb-4">
          <p><strong>Nom:</strong> ${selectedPatient.name}</p>
          <p><strong>Âge:</strong> ${selectedPatient.age} ans</p>
          <p><strong>UHID:</strong> ${selectedPatient.uhid}</p>
        </div>
        <p class="mb-2"><strong>Diagnostic:</strong> ${diagnostic || "[Diagnostic]"}</p>
        <p class="mb-2"><strong>Traitement prescrit:</strong> ${treatment || "[Traitement]"}</p>
        <p class="mb-4"><strong>Durée d'arrêt de travail:</strong> ${duration || "[Durée]"} jours</p>
        ${additionalInfo ? `<p class="mb-4">${additionalInfo}</p>` : ""}
        <div class="flex justify-between mt-8">
          <div>
            <p>Le ${formatDate(date)}</p>
            <p class="mt-8">Signature et cachet</p>
          </div>
          <div class="text-right">
            <p>À ${place}, le ${formatDate(date)}</p>
          </div>
        </div>
      `,
      "blood-request": `
        <h2 class="text-center font-bold text-xl mb-4" style="color: #018a8c;">DEMANDE DE SANG</h2>
        <p class="mb-4">Je soussigné(e), ${doctorName}, demande ${quantity || "[Quantité]"} unités de sang de type ${bloodType || "[Groupe sanguin]"} pour:</p>
        <div class="ml-4 mb-4">
          <p><strong>Nom:</strong> ${selectedPatient.name}</p>
          <p><strong>Âge:</strong> ${selectedPatient.age} ans</p>
          <p><strong>UHID:</strong> ${selectedPatient.uhid}</p>
          <p><strong>Service:</strong> ${service || "[Service]"}</p>
        </div>
        <p class="mb-4"><strong>Motif:</strong> ${additionalInfo || "[Motif de la demande]"}</p>
        <div class="flex justify-between mt-8">
          <div>
            <p>Le ${formatDate(date)}</p>
            <p class="mt-8">Signature et cachet</p>
          </div>
          <div class="text-right">
            <p>À ${place}, le ${formatDate(date)}</p>
          </div>
        </div>
      `,
      general: `
        <h2 class="text-center font-bold text-xl mb-4" style="color: #018a8c;">CERTIFICAT MÉDICAL GÉNÉRAL</h2>
        <p class="mb-4">Je soussigné(e), ${doctorName}, certifie que <strong>${selectedPatient.name}</strong>, âgé(e) de ${selectedPatient.age} ans, a été examiné(e) ce jour et est dans l'état de santé suivant: ${additionalInfo || "[Description]"}.</p>
        <div class="flex justify-between mt-8">
          <div>
            <p>Le ${formatDate(date)}</p>
            <p class="mt-8">Signature et cachet</p>
          </div>
          <div class="text-right">
            <p>À ${place}, le ${formatDate(date)}</p>
          </div>
        </div>
      `,
      fitness: `
        <h2 class="text-center font-bold text-xl mb-4" style="color: #018a8c;">CERTIFICAT D'APTITUDE</h2>
        <p class="mb-4">Je soussigné(e), ${doctorName}, certifie que <strong>${selectedPatient.name}</strong>, âgé(e) de ${selectedPatient.age} ans, est médicalement apte à ${activity || "[Activité concernée]"}.</p>
        <p class="mb-4"><strong>Ce certificat est valable jusqu'au:</strong> ${validity || "[Date de fin de validité]"}</p>
        ${additionalInfo ? `<p class="mb-4">${additionalInfo}</p>` : ""}
        <div class="flex justify-between mt-8">
          <div>
            <p>Le ${formatDate(date)}</p>
            <p class="mt-8">Signature et cachet</p>
          </div>
          <div class="text-right">
            <p>À ${place}, le ${formatDate(date)}</p>
          </div>
        </div>
      `,
    };

    return templates[activeCertificate];
  };

  const handlePrintCertificate = () => {
    if (activeCertificate === "birth") {
      if (
        !certificateData.birthHour ||
        !certificateData.childGender ||
        !certificateData.nameMother
      ) {
        alert(
          "Veuillez remplir tous les champs obligatoires pour le certificat de naissance"
        );
        return;
      }
    }

    if (activeCertificate === "death" && !certificateData.deathHour) {
      alert("Veuillez renseigner l'heure du décès");
      return;
    }

    const content = generateCertificateContent();
    const printWindow = window.open("", "_blank");

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Certificat Médical</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');
              
              body { 
                font-family: 'Montserrat', Arial, sans-serif;
                padding: 40px 60px; 
                line-height: 1.6;
                color: #333;
                background-color: #f9f9f9;
              }
              
              .certificate-container {
                background: white;
                padding: 40px;
                border-radius: 8px;
                box-shadow: 0 0 20px rgba(0,0,0,0.05);
                position: relative;
                border: 1px solid #e1e1e1;
              }
              
              .watermark {
                position: absolute;
                opacity: 0.1;
                font-size: 120px;
                font-weight: bold;
                color: #018a8c;
                transform: rotate(-30deg);
                pointer-events: none;
                z-index: 0;
                top: 30%;
                left: 20%;
              }
              
              .header { 
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #018a8c;
                position: relative;
                z-index: 1;
              }
              
              .logo img {
                max-height: 100px;
                filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
              }
              
              .clinic-info {
                text-align: right;
              }
              
              .clinic-name { 
                font-size: 14px; 
                font-weight: 500; 
                color: #018a8c;
                margin-bottom: 5px;
                letter-spacing: 0.5px;
              }
              
              .clinic-details {
                font-size: 14px; 
                color: #666;
                line-height: 1.4;
              }
              
              .document-title {
                text-align: center;
                font-size: 28px;
                font-weight: 600;
                color: #018a8c;
                margin: 40px 0;
                text-transform: uppercase;
                letter-spacing: 1px;
              }
              
              .content { 
                margin: 40px 0;
                position: relative;
                z-index: 1;
                font-size: 16px;
              }
              
              .content p {
                margin-bottom: 15px;
                text-align: justify;
              }
              
              .footer { 
                margin-top: 80px;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
              }
              
              .signature {
                text-align: center;
                margin-top: 60px;
              }
              
              .signature-line {
                width: 250px;
                height: 1px;
                background-color: #333;
                margin: 20px auto;
              }
              
              .signature-text {
                font-weight: 600;
                margin-top: 10px;
              }
              
              .certificate-number {
                font-size: 12px;
                color: #888;
                text-align: right;
                margin-top: 20px;
              }
              
              .footer-note {
                font-size: 12px;
                color: #888;
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e1e1e1;
              }
              
              strong {
                font-weight: 600;
              }
              
              .seal {
                position: absolute;
                right: 50px;
                bottom: 50px;
                opacity: 0.8;
                width: 80px;
              }
            </style>
          </head>
          <body>
            <div class="certificate-container">
              <div class="watermark">CLINIQUE ENIAZOU</div>
              
              <div class="header">
                <div class="logo">
                  <img src="${logo}" alt="Logo Clinique Eniazou">
                </div>
                <div class="clinic-info">
                  <div class="clinic-name">CLINIQUE MÉDICALE ENIAZOU</div>
                  <div class="clinic-details">
                    Abidjan, Yopougon Selmer<br>
                    Côte d'Ivoire<br>
                    Tél: +225 07 08 39 77 87<br>
                    Email: cliniqueeniazou@gmail.com
                  </div>
                </div>
              </div>
              
              <div class="content">
                ${content}
              </div>
              
              <div class="footer">
                <div class="certificate-number">
                  Référence: CM-${new Date().getFullYear()}-${Math.floor(
                    Math.random() * 10000
                  )
                    .toString()
                    .padStart(4, "0")}
                </div>
                
                <div class="signature">
                  <div class="signature-line"></div>
                  <div class="signature-text">Le Médecin Responsable</div>
                </div>
              </div>
              
              <img class="seal" src="data:image/svg+xml;base64,..." alt="Sceau médical">
              
              <div class="footer-note">
                - Document officiel - Tous droits réservés © ${new Date().getFullYear()} Clinique Médicale Eniazou -
              </div>
            </div>
            
            <script>
              setTimeout(() => {
                window.print();
                window.close();
              }, 500);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const getGenderIcon = (gender: string) => {
    return gender === "Féminin" ? (
      <span className="text-pink-500">♀</span>
    ) : (
      <span className="text-blue-500">♂</span>
    );
  };

  const getCertificateName = (type: CertificateType): string => {
    const names = {
      birth: "Certificat de naissance",
      death: "Certificat de décès",
      medical: "Certificat médical",
      "blood-request": "Demande de sang",
      general: "Certificat général",
      fitness: "Certificat d'aptitude",
    };
    return names[type];
  };

  const renderCertificateFields = () => {
    if (!activeCertificate) return null;

    const commonFields = (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Nom du médecin *</Label>
            <Input
              value={certificateData.doctorName}
              onChange={(e) => handleInputChange("doctorName", e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Date *</Label>
            <Input
              type="date"
              value={certificateData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Lieu/Ville *</Label>
            <Input
              value={certificateData.place}
              onChange={(e) => handleInputChange("place", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <Label>Informations supplémentaires</Label>
          <Textarea
            value={certificateData.additionalInfo}
            onChange={(e) =>
              handleInputChange("additionalInfo", e.target.value)
            }
            rows={3}
          />
        </div>
      </>
    );

    switch (activeCertificate) {
      case "birth":
        return (
          <>
            {commonFields}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label>Heure de naissance *</Label>
                <Input
                  type="time"
                  value={certificateData.birthHour || ""}
                  onChange={(e) =>
                    handleInputChange("birthHour", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label>Sexe de l'enfant *</Label>
                <Select
                  value={certificateData.childGender || ""}
                  onValueChange={(value) =>
                    handleInputChange("childGender", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez le sexe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculin">Masculin</SelectItem>
                    <SelectItem value="Féminin">Féminin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label>Nom complet de la mère *</Label>
                <Input
                  value={certificateData.nameMother || ""}
                  onChange={(e) =>
                    handleInputChange("nameMother", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label>Date de naissance de la mère</Label>
                <Input
                  type="date"
                  value={certificateData.birthMother || ""}
                  onChange={(e) =>
                    handleInputChange("birthMother", e.target.value)
                  }
                />
              </div>
            </div>
          </>
        );

      case "death":
        return (
          <>
            {commonFields}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label>Heure du décès *</Label>
                <Input
                  type="time"
                  value={certificateData.deathHour || ""}
                  onChange={(e) =>
                    handleInputChange("deathHour", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label>Cause du décès *</Label>
                <Input
                  value={certificateData.cause || ""}
                  onChange={(e) => handleInputChange("cause", e.target.value)}
                  required
                />
              </div>
            </div>
          </>
        );

      case "medical":
        return (
          <>
            {commonFields}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label>Diagnostic *</Label>
                <Input
                  value={certificateData.diagnostic || ""}
                  onChange={(e) =>
                    handleInputChange("diagnostic", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label>Traitement prescrit</Label>
                <Input
                  value={certificateData.treatment || ""}
                  onChange={(e) =>
                    handleInputChange("treatment", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Durée d'arrêt de travail (jours)</Label>
                <Input
                  type="number"
                  value={certificateData.duration || ""}
                  onChange={(e) =>
                    handleInputChange("duration", e.target.value)
                  }
                />
              </div>
            </div>
          </>
        );

      case "blood-request":
        return (
          <>
            {commonFields}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label>Groupe sanguin *</Label>
                <Input
                  value={certificateData.bloodType || ""}
                  onChange={(e) =>
                    handleInputChange("bloodType", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label>Quantité (unités) *</Label>
                <Input
                  type="number"
                  value={certificateData.quantity || ""}
                  onChange={(e) =>
                    handleInputChange("quantity", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label>Service *</Label>
                <Input
                  value={certificateData.service || ""}
                  onChange={(e) => handleInputChange("service", e.target.value)}
                  required
                />
              </div>
            </div>
          </>
        );

      case "fitness":
        return (
          <>
            {commonFields}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label>Activité concernée *</Label>
                <Input
                  value={certificateData.activity || ""}
                  onChange={(e) =>
                    handleInputChange("activity", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label>Date de fin de validité *</Label>
                <Input
                  type="date"
                  value={certificateData.validity || ""}
                  onChange={(e) =>
                    handleInputChange("validity", e.target.value)
                  }
                  required
                />
              </div>
            </div>
          </>
        );

      default:
        return commonFields;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <h2 className="text-lg font-semibold text-[#018a8c] mb-4">
              Types de Certificats
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleCertificateSelect("birth")}
                className={`p-3 rounded-lg border transition-all duration-200 flex items-center justify-center text-sm font-medium ${
                  activeCertificate === "birth"
                    ? "border-[#018a8c] bg-[#018a8c] text-white"
                    : "border-gray-200 hover:border-[#018a8c]/50 hover:bg-[#018a8c]/5 text-gray-700"
                }`}
              >
                Naissance
              </button>
              <button
                onClick={() => handleCertificateSelect("death")}
                className={`p-3 rounded-lg border transition-all duration-200 flex items-center justify-center text-sm font-medium ${
                  activeCertificate === "death"
                    ? "border-[#018a8c] bg-[#018a8c] text-white"
                    : "border-gray-200 hover:border-[#018a8c]/50 hover:bg-[#018a8c]/5 text-gray-700"
                }`}
              >
                Décès
              </button>
              <button
                onClick={() => handleCertificateSelect("medical")}
                className={`p-3 rounded-lg border transition-all duration-200 flex items-center justify-center text-sm font-medium ${
                  activeCertificate === "medical"
                    ? "border-[#018a8c] bg-[#018a8c] text-white"
                    : "border-gray-200 hover:border-[#018a8c]/50 hover:bg-[#018a8c]/5 text-gray-700"
                }`}
              >
                Médical
              </button>
              <button
                onClick={() => handleCertificateSelect("blood-request")}
                className={`p-3 rounded-lg border transition-all duration-200 flex items-center justify-center text-sm font-medium ${
                  activeCertificate === "blood-request"
                    ? "border-[#018a8c] bg-[#018a8c] text-white"
                    : "border-gray-200 hover:border-[#018a8c]/50 hover:bg-[#018a8c]/5 text-gray-700"
                }`}
              >
                Demande sang
              </button>
              <button
                onClick={() => handleCertificateSelect("general")}
                className={`p-3 rounded-lg border transition-all duration-200 flex items-center justify-center text-sm font-medium ${
                  activeCertificate === "general"
                    ? "border-[#018a8c] bg-[#018a8c] text-white"
                    : "border-gray-200 hover:border-[#018a8c]/50 hover:bg-[#018a8c]/5 text-gray-700"
                }`}
              >
                Général
              </button>
              <button
                onClick={() => handleCertificateSelect("fitness")}
                className={`p-3 rounded-lg border transition-all duration-200 flex items-center justify-center text-sm font-medium ${
                  activeCertificate === "fitness"
                    ? "border-[#018a8c] bg-[#018a8c] text-white"
                    : "border-gray-200 hover:border-[#018a8c]/50 hover:bg-[#018a8c]/5 text-gray-700"
                }`}
              >
                Aptitude
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            {selectedPatient ? (
              <>
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
                      <span className="truncate">
                        {selectedPatient.address}
                      </span>
                    </div>
                  </div>
                </div>

                {activeCertificate ? (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold text-[#018a8c] border-b pb-2">
                        {getCertificateName(activeCertificate)}
                      </h2>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        {isEditing ? "Prévisualiser" : "Modifier"}
                      </Button>
                    </div>

                    {isEditing ? (
                      <div className="space-y-4">
                        {renderCertificateFields()}
                      </div>
                    ) : (
                      <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: generateCertificateContent(),
                        }}
                      />
                    )}

                    <div className="flex justify-end gap-3 mt-6">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setActiveCertificate(null);
                          setIsEditing(false);
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
                      className="h-10 w-10 mb-3 text-gray-400"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" x2="8" y1="13" y2="13" />
                      <line x1="16" x2="8" y1="17" y2="17" />
                      <line x1="10" x2="8" y1="9" y2="9" />
                    </svg>
                    <h3 className="text-lg font-medium">
                      Aucun certificat sélectionné
                    </h3>
                    <p className="text-sm">
                      Veuillez sélectionner un type de certificat
                    </p>
                  </div>
                )}
              </>
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
          </div>
        </div>
      </div>
    </div>
  );
}
