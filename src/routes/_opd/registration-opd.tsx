"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { createFileRoute } from "@tanstack/react-router";
import {
  Search,
  User,
  Phone,
  Calendar,
  MapPin,
  Heart,
  Mail,
  Stethoscope,
  Save,
  Printer,
  Edit,
  ClipboardPlus,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PaymentPDF } from "@/pdf/paymentPDF";
import { UHIDPDF } from "@/pdf/uhidPDF";

// Types pour les données du patient
type Patient = {
  id: number;
  uhid: string;
  opdId: string;
  name: string;
  phone: string;
  dateTime: string;
  department: string;
  gender: string;
  bloodGroup: string;
  email: string;
  patientImage: string;
  doctor: string;
  fees: string;
  paymentMode: string;
  dob: string;
  resident: string;
  transactionId: string;
};

// Données fictives pour les patients
const initialPatients: Patient[] = [
  {
    id: 1,
    uhid: "UHID456",
    name: "Jean Dupont",
    phone: "+225 01 23 45 67 89",
    dateTime: "2023-10-15T10:00",
    department: "Cardiologie",
    gender: "Male",
    bloodGroup: "A+",
    email: "jean.dupont@example.com",
    patientImage: "",
    opdId: "OPD123",
    doctor: "Dr. Martin",
    fees: "15000 FCFA",
    paymentMode: "Espèces",
    dob: "",
    resident: "",
    transactionId: "",
  },
];

export const Route = createFileRoute("/_opd/registration-opd")({
  component: RouteComponent,
});

function RouteComponent() {
  const [formData, setFormData] = useState<Patient>({
    id: 0,
    uhid: "",
    name: "",
    phone: "",
    dateTime: "",
    department: "",
    gender: "",
    bloodGroup: "",
    email: "",
    patientImage: "",
    opdId: "",
    doctor: "",
    fees: "",
    paymentMode: "",
    dob: "",
    resident: "",
    transactionId: "",
  });

  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [paymentMethod, setPaymentMethod] = useState("Espèces");
  const [currentPage, setCurrentPage] = useState(1); // Pagination
  const itemsPerPage = 5; // Nombre d'éléments par page

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: keyof Patient, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value); // Met à jour l'état local
    setFormData((prev) => ({ ...prev, paymentMode: value })); // Met à jour formData
  };

  const handleSave = () => {
    const requiredFields: (keyof Patient)[] = [
      "name",
      "phone",
      "dateTime",
      "paymentMode",
    ];
    if (paymentMethod === "Espèces") {
      requiredFields.push("fees");
    } else if (paymentMethod === "Enligne") {
      requiredFields.push("transactionId");
    }

    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      toast.error(
        `Veuillez remplir les champs obligatoires: ${missingFields.join(", ")}`
      );
      return;
    }

    const newPatient = { ...formData, id: patients.length + 1 };
    setPatients((prev) => [...prev, newPatient]);
    toast.success("Patient enregistré avec succès !");
    setFormData({
      id: 0,
      uhid: "",
      name: "",
      phone: "",
      dateTime: "",
      department: "",
      gender: "",
      bloodGroup: "",
      email: "",
      patientImage: "",
      opdId: "",
      doctor: "",
      fees: "",
      paymentMode: "",
      dob: "",
      resident: "",
      transactionId: "",
    });
  };

  const handleUpdate = (patient: Patient) => {
    setFormData(patient); // Remplir le formulaire avec les données du patient sélectionné
    toast.info(`Modification du patient ${patient.name}`);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPatients = patients.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 space-y-6 bg-gradient-to-r from-blue-50 to-purple-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#018a8c] to-[#016a6c]">
          Enregistrement des Patients
        </h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#018a8c]">
            Informations du Patient
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/** Informations personnelles */}
          <div>
            {/* UHID */}
            <div className="space-y-2 mb-4">
              <Label
                htmlFor="uhid"
                className="flex items-center gap-2 text-[#018a8c]"
              >
                <Search className="h-4 w-4" /> UHID
              </Label>
              <Input
                id="uhid"
                placeholder="Entrer UHID"
                value={formData.uhid}
                onChange={handleInputChange}
                className="border-[#018a8c] focus:border-[#016a6c]"
              />
            </div>

            {/* Nom du Patient */}
            <div className="space-y-2 mb-4">
              <Label
                htmlFor="name"
                className="flex items-center gap-2 text-[#018a8c]"
              >
                <User className="h-4 w-4" /> Nom du Patient
              </Label>
              <Input
                id="name"
                placeholder="Entrer le nom du patient"
                value={formData.name}
                onChange={handleInputChange}
                className="border-[#018a8c] focus:border-[#016a6c]"
              />
            </div>

            {/* Numéro de Téléphone */}
            <div className="space-y-2 mb-4">
              <Label
                htmlFor="phone"
                className="flex items-center gap-2 text-[#018a8c]"
              >
                <Phone className="h-4 w-4" /> Numéro de Téléphone
              </Label>
              <Input
                id="phone"
                placeholder="Entrer le numéro de téléphone"
                value={formData.phone}
                onChange={handleInputChange}
                className="border-[#018a8c] focus:border-[#016a6c]"
              />
            </div>

            {/* Email */}
            <div className="space-y-2 mb-4">
              <Label
                htmlFor="email"
                className="flex items-center gap-2 text-[#018a8c]"
              >
                <Mail className="h-4 w-4" /> Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Entrer l'email"
                value={formData.email}
                onChange={handleInputChange}
                className="border-[#018a8c] focus:border-[#016a6c]"
              />
            </div>

            {/* Residence */}
            <div className="space-y-2 mb-4">
              <Label
                htmlFor="resident"
                className="flex items-center gap-2 text-[#018a8c]"
              >
                <MapPin className="h-4 w-4" /> Residence
              </Label>
              <Input
                id="resident"
                type="text"
                placeholder="Entrer la residence"
                value={formData.resident}
                onChange={handleInputChange}
                className="border-[#018a8c] focus:border-[#016a6c]"
              />
            </div>
          </div>

          {/** Informations médicales */}
          <div>
            {/* Date de naissance */}
            <div className="space-y-2 mb-4">
              <Label
                htmlFor="dob"
                className="flex items-center gap-2 text-[#018a8c]"
              >
                <Calendar className="h-4 w-4" /> Date de naissance
              </Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={handleInputChange}
                className="border-[#018a8c] focus:border-[#016a6c]"
              />
            </div>

            {/* Groupe Sanguin */}
            <div className="space-y-2 mb-4">
              <Label
                htmlFor="bloodGroup"
                className="flex items-center gap-2 text-[#018a8c]"
              >
                <Heart className="h-4 w-4" /> Groupe Sanguin
              </Label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange("bloodGroup", value)
                }
                value={formData.bloodGroup}
              >
                <SelectTrigger className="border-[#018a8c] focus:border-[#016a6c]">
                  <SelectValue placeholder="Sélectionnez un groupe sanguin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NA">NA</SelectItem>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Genre */}
            <div className="space-y-2 mb-4">
              <Label
                htmlFor="gender"
                className="flex items-center gap-2 text-[#018a8c]"
              >
                <User className="h-4 w-4" /> Genre
              </Label>
              <Select
                onValueChange={(value) => handleSelectChange("gender", value)}
                value={formData.gender}
              >
                <SelectTrigger className="border-[#018a8c] focus:border-[#016a6c]">
                  <SelectValue placeholder="Sélectionnez un genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Homme</SelectItem>
                  <SelectItem value="Female">Femme</SelectItem>
                  <SelectItem value="Other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Département */}
            <div className="space-y-2 mb-4">
              <Label
                htmlFor="department"
                className="flex items-center gap-2 text-[#018a8c]"
              >
                <Stethoscope className="h-4 w-4" /> Département
              </Label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange("department", value)
                }
                value={formData.department}
              >
                <SelectTrigger className="border-[#018a8c] focus:border-[#016a6c]">
                  <SelectValue placeholder="Sélectionnez un département" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Médecine Générale">
                    Médecine Générale
                  </SelectItem>
                  <SelectItem value="Gynécologie-Obstétrique">
                    Gynécologie-Obstétrique
                  </SelectItem>
                  <SelectItem value="Radiologie et Imagerie Médicale">
                    Radiologie et Imagerie Médicale
                  </SelectItem>
                  <SelectItem value="Pédiatrie">Pédiatrie</SelectItem>
                  <SelectItem value="Ophtalmologie">Ophtalmologie</SelectItem>
                  <SelectItem value="Urgences">Urgences</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Medecin traitant */}
            <div className="space-y-2 mb-4">
              <Label
                htmlFor="refered"
                className="flex items-center gap-2 text-[#018a8c]"
              >
                <User className="h-4 w-4" /> Médecin traitant
              </Label>
              <Input
                id="doctor"
                type="text"
                placeholder=""
                value={formData.doctor}
                onChange={handleInputChange}
                className="border-[#018a8c] focus:border-[#016a6c]"
              />
            </div>
          </div>

          {/** Details du rendez-vous */}
          <div>
            {/* Date et Heure */}
            <div className="space-y-2 mb-4">
              <Label
                htmlFor="dateTime"
                className="flex items-center gap-2 text-[#018a8c]"
              >
                <Calendar className="h-4 w-4" /> Date et Heure
              </Label>
              <Input
                id="dateTime"
                type="datetime-local"
                value={formData.dateTime}
                onChange={handleInputChange}
                className="border-[#018a8c] focus:border-[#016a6c]"
              />
            </div>

            {/* Paiement */}
            <div className="space-y-2 mb-4">
              <Label
                htmlFor="paymentMode"
                className="flex items-center gap-2 text-[#018a8c]"
              >
                <Mail className="h-4 w-4" /> Paiement
              </Label>
              <Select
                onValueChange={handlePaymentMethodChange}
                value={paymentMethod}
              >
                <SelectTrigger className="border-[#018a8c] focus:border-[#016a6c]">
                  <SelectValue placeholder="Espèces" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Espèces">Espèces</SelectItem>
                  <SelectItem value="Enligne">En ligne</SelectItem>
                </SelectContent>
              </Select>

              {paymentMethod === "Espèces" && (
                <div className="space-y-2">
                  <Label htmlFor="fees" className="text-[#018a8c]">
                    Frais
                  </Label>
                  <Input
                    id="fees"
                    placeholder="Entrez les frais"
                    value={formData.fees}
                    onChange={handleInputChange}
                    className="border-[#018a8c]"
                  />
                </div>
              )}

              {paymentMethod === "Enligne" && (
                <div className="space-y-2">
                  <Label htmlFor="transactionId" className="text-[#018a8c]">
                    ID. Transaction
                  </Label>
                  <Input
                    id="transactionId"
                    placeholder="Entrez l'ID de la transaction"
                    value={formData.transactionId}
                    onChange={handleInputChange}
                    className="border-[#018a8c]"
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button
            variant="outline"
            className="border-[#018a8c] text-[#018a8c] hover:bg-[#018a8c] hover:text-white"
          >
            Annuler
          </Button>
          <Button
            className="bg-gradient-to-r from-[#018a8c] to-[#016a6c] hover:from-[#016a6c] hover:to-[#018a8c] text-white"
            onClick={handleSave}
          >
            <Save className="mr-2 h-4 w-4" /> Enregistrer
          </Button>
        </CardFooter>
      </Card>

      {/* Tableau des Patients */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#018a8c]"></CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Liste des patients enregistrés</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">S.No</TableHead>
                <TableHead className="text-center">File d'attente</TableHead>
                <TableHead className="text-center">OPD ID</TableHead>
                <TableHead className="text-center">UHID</TableHead>
                <TableHead>Nom Patient</TableHead>
                <TableHead>Département</TableHead>
                <TableHead>Médecin</TableHead>
                <TableHead>Frais</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Processus</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="text-center">{patient.id}</TableCell>
                  <TableCell className="text-center">001</TableCell>
                  <TableCell className="text-center">{patient.opdId}</TableCell>
                  <TableCell className="text-center">
                    {patient.uhid}{" "}
                    <PDFDownloadLink
                      document={<UHIDPDF patient={patient} />}
                      fileName={`patient_${patient.id}.pdf`}
                      className="inline-block"
                    >
                      <Button
                        variant="ghost"
                        className="text-[#018a8c] hover:text-[#016a6c]"
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                    </PDFDownloadLink>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      className="text-[#018a8c] hover:text-[#016a6c]"
                      onClick={() => handleUpdate(patient)}
                    >
                      <Edit className="h-4 w-4"></Edit>
                    </Button>

                    {patient.name}
                  </TableCell>
                  <TableCell>{patient.department}</TableCell>
                  <TableCell>{patient.doctor}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      className="text-[#018a8c] hover:text-[#016a6c]"
                      onClick={() => handleUpdate(patient)}
                    >
                      <Edit className="h-4 w-4"></Edit>
                    </Button>
                    {patient.fees}
                  </TableCell>
                  <TableCell>
                    {patient.paymentMode}
                    {/* Impression PDF */}
                    <PDFDownloadLink
                      document={<PaymentPDF patient={patient} />}
                      fileName={`payment_${patient.id}.pdf`}
                      className="inline-block"
                    >
                      {({ loading }) => (
                        <Button
                          variant="ghost"
                          className="text-[#018a8c] hover:text-[#016a6c]"
                          disabled={loading}
                        >
                          <Printer className="h-4 w-4" />
                          {loading ? "Chargement..." : ""}
                        </Button>
                      )}
                    </PDFDownloadLink>
                  </TableCell>
                  <TableCell>
                    <ClipboardPlus />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={11} className="text-center">
                  Total Patients: {patients.length}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>

        {/* Pagination */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => paginate(currentPage - 1)}
                className="text-[#018a8c] hover:text-[#016a6c]"
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {Array.from({
              length: Math.ceil(patients.length / itemsPerPage),
            }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => paginate(index + 1)}
                  isActive={currentPage === index + 1}
                  className="text-[#018a8c] hover:text-[#016a6c]"
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => paginate(currentPage + 1)}
                className="text-[#018a8c] hover:text-[#016a6c]"
                disabled={
                  currentPage === Math.ceil(patients.length / itemsPerPage)
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </Card>
    </div>
  );
}

// Fonction pour transformer les données du patient en format de paiement
const transformPatientToPayment = (patient: Patient): Payment => {
  const [date, heure] = patient.dateTime.split("T"); // Séparer la date et l'heure

  return {
    id: patient.id,
    patient: {
      numerofacture: patient.opdId,
      uhid: patient.uhid,
      nom: patient.name,
      prenom: "",
      dateNaissance: patient.dob,
      sexe: patient.gender,
      telephone: patient.phone,
      adresse: patient.resident,
      date: date,
      heure: heure,
      departement: patient.department,
      doctor: patient.doctor,
    },
    clinique: {
      nom: "Clinique Médicale Eniazou",
      adresse: "123 Rue de la Santé, Abidjan",
      telephone: "+225 01 23 45 67 89",
      email: "contact@cliniquexyz.com",
    },
    paiement: {
      cout: parseFloat(patient.fees.replace(" FCFA", "")) || 0, // Convertir les frais en nombre
      mode: patient.paymentMode,
      statut: "Payé",
    },
  };
};

// Interface Payment
interface Payment {
  id: number;
  patient: {
    numerofacture: string;
    uhid: string;
    nom: string;
    prenom: string;
    dateNaissance: string;
    sexe: string;
    telephone: string;
    adresse: string;
    date: string;
    heure: string;
    departement: string;
    doctor: string;
  };
  clinique: {
    nom: string;
    adresse: string;
    telephone: string;
    email: string;
  };
  paiement: {
    cout: number;
    mode: string;
    statut: string;
  };
}
