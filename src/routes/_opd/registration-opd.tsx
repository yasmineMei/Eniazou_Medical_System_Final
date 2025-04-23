"use client";

import { useState, useReducer, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PDFDownloadLink } from "@react-pdf/renderer";
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
  Trash2,
} from "lucide-react";

// Components
import { Input } from "@/components/ui/input";
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

// PDF Components
import { PaymentPDF } from "@/pdf/paymentPDF";

// Types
type Patient = {
  id: number;
  uhid: string;
  queue: string;
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

type PatientState = {
  patients: Patient[];
  formData: Patient;
  currentPage: number;
  paymentMethod: string;
  isEditing: boolean;
};

type PatientAction =
  | { type: "SET_FIELD"; field: keyof Patient; value: string }
  | { type: "RESET_FORM" }
  | { type: "ADD_PATIENT"; patient: Patient }
  | { type: "UPDATE_PATIENT"; patient: Patient }
  | { type: "DELETE_PATIENT"; id: number }
  | { type: "SET_PATIENT"; patient: Patient }
  | { type: "SET_PAGE"; page: number }
  | { type: "SET_PAYMENT_METHOD"; method: string }
  | { type: "SET_EDITING"; isEditing: boolean };

// Initial data
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
    queue: "1",
    doctor: "Dr. Martin",
    fees: "15000 FCFA",
    paymentMode: "Espèces",
    dob: "1980-01-01",
    resident: "Abidjan, Cocody",
    transactionId: "",
  },
];

const initialState: PatientState = {
  patients: initialPatients,
  formData: {
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
    queue: "",
    doctor: "",
    fees: "",
    paymentMode: "",
    dob: "",
    resident: "",
    transactionId: "",
  },
  currentPage: 1,
  paymentMethod: "Espèces",
  isEditing: false,
};

// Reducer
function patientReducer(
  state: PatientState,
  action: PatientAction
): PatientState {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        formData: { ...state.formData, [action.field]: action.value },
      };
    case "RESET_FORM":
      return {
        ...state,
        formData: initialState.formData,
        isEditing: false,
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: [...state.patients, action.patient],
        formData: initialState.formData,
        isEditing: false,
      };
    case "UPDATE_PATIENT":
      return {
        ...state,
        patients: state.patients.map((patient) =>
          patient.id === action.patient.id ? action.patient : patient
        ),
        formData: initialState.formData,
        isEditing: false,
      };
    case "DELETE_PATIENT":
      return {
        ...state,
        patients: state.patients.filter((patient) => patient.id !== action.id),
      };
    case "SET_PATIENT":
      return {
        ...state,
        formData: action.patient,
        isEditing: true,
      };
    case "SET_PAGE":
      return { ...state, currentPage: action.page };
    case "SET_PAYMENT_METHOD":
      return {
        ...state,
        paymentMethod: action.method,
        formData: { ...state.formData, paymentMode: action.method },
      };
    case "SET_EDITING":
      return {
        ...state,
        isEditing: action.isEditing,
      };
    default:
      return state;
  }
}

export const Route = createFileRoute("/_opd/registration-opd")({
  component: RegistrationPage,
});

function RegistrationPage() {
  const [state, dispatch] = useReducer(patientReducer, initialState);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 5;

  // Filter and paginate patients
  const { currentPatients, totalPages } = useMemo(() => {
    const filteredPatients = state.patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.uhid.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.queue.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = state.currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPatients = filteredPatients.slice(
      indexOfFirstItem,
      indexOfLastItem
    );
    const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
    return { currentPatients, totalPages, filteredPatients };
  }, [state.patients, state.currentPage, searchTerm]);

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    dispatch({ type: "SET_FIELD", field: id as keyof Patient, value });
  };

  const handleSelectChange = (field: keyof Patient, value: string) => {
    dispatch({ type: "SET_FIELD", field, value });
  };

  const handlePaymentMethodChange = (method: string) => {
    dispatch({ type: "SET_PAYMENT_METHOD", method });
  };

  const handleSave = () => {
    // Validation des champs obligatoires
    if (
      !state.formData.name ||
      !state.formData.phone ||
      !state.formData.dateTime
    ) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (state.paymentMethod === "Espèces" && !state.formData.fees) {
      toast.error("Veuillez entrer les frais de consultation");
      return;
    }

    if (state.paymentMethod === "Enligne" && !state.formData.transactionId) {
      toast.error("Veuillez entrer l'ID de transaction");
      return;
    }

    // Génération du numéro de file d'attente si vide
    const queue = state.formData.queue || `${state.patients.length + 1}`;

    const patientData = {
      ...state.formData,
      queue,
      paymentMode: state.paymentMethod,
      fees: state.formData.fees ? `${state.formData.fees} FCFA` : "0 FCFA",
    };

    if (state.isEditing) {
      // Mise à jour patient existant
      dispatch({ type: "UPDATE_PATIENT", patient: patientData });
      toast.success("Patient mis à jour avec succès !");
    } else {
      // Nouveau patient
      const newPatient: Patient = {
        ...patientData,
        id:
          state.patients.length > 0
            ? Math.max(...state.patients.map((p) => p.id)) + 1
            : 1,
      };
      dispatch({ type: "ADD_PATIENT", patient: newPatient });
      toast.success("Patient enregistré avec succès !");
    }
  };

  const handleUpdate = (patient: Patient) => {
    dispatch({ type: "SET_PATIENT", patient });
    dispatch({ type: "SET_PAYMENT_METHOD", method: patient.paymentMode });
    toast.info(`Modification du patient ${patient.name}`);
  };

  const handleDelete = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce patient ?")) {
      dispatch({ type: "DELETE_PATIENT", id });
      toast.success("Patient supprimé avec succès");
    }
  };

  const handleCancel = () => {
    dispatch({ type: "RESET_FORM" });
  };

  const handlePageChange = (page: number) => {
    dispatch({ type: "SET_PAGE", page });
  };

  // Function to prepare patient data for PDF
  const preparePatientForPDF = (patient: Patient) => {
    const [date, time] = patient.dateTime.split("T");
    return {
      ...patient,
      date: new Date(date).toLocaleDateString(),
      time: time.substring(0, 5),
      amount: patient.fees ? parseFloat(patient.fees.replace(" FCFA", "")) : 0,
    };
  };

  // Styles
  const styles = {
    input:
      "border-[#018a8c] focus:border-[#016a6c] focus-visible:ring-[#018a8c]",
    button:
      "bg-gradient-to-r from-[#018a8c] to-[#016a6c] hover:from-[#016a6c] hover:to-[#018a8c] text-white",
    card: "shadow-lg border border-gray-100 rounded-xl",
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#018a8c] to-[#016a6c]">
          Enregistrement des Patients
        </h1>
      </div>

      {/* Patient Form */}
      <Card className={styles.card}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#018a8c]">
            Informations du Patient
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Personal Information Column */}
          <div>
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
                value={state.formData.uhid}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

            <div className="space-y-2 mb-4">
              <Label
                htmlFor="queue"
                className="flex items-center gap-2 text-[#018a8c]"
              >
                <User className="h-4 w-4" /> Numéro de file d'attente
              </Label>
              <Input
                id="queue"
                placeholder="Numéro de file"
                value={state.formData.queue}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

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
                value={state.formData.name}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>

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
                value={state.formData.phone}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>

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
                value={state.formData.email}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

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
                value={state.formData.resident}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
          </div>

          {/* Medical Information Column */}
          <div>
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
                value={state.formData.dob}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

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
                value={state.formData.bloodGroup}
              >
                <SelectTrigger className={styles.input}>
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

            <div className="space-y-2 mb-4">
              <Label
                htmlFor="gender"
                className="flex items-center gap-2 text-[#018a8c]"
              >
                <User className="h-4 w-4" /> Genre
              </Label>
              <Select
                onValueChange={(value) => handleSelectChange("gender", value)}
                value={state.formData.gender}
              >
                <SelectTrigger className={styles.input}>
                  <SelectValue placeholder="Sélectionnez un genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Homme</SelectItem>
                  <SelectItem value="Female">Femme</SelectItem>
                  <SelectItem value="Other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
                value={state.formData.department}
              >
                <SelectTrigger className={styles.input}>
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

            <div className="space-y-2 mb-4">
              <Label
                htmlFor="doctor"
                className="flex items-center gap-2 text-[#018a8c]"
              >
                <User className="h-4 w-4" /> Médecin traitant
              </Label>
              <Input
                id="doctor"
                type="text"
                placeholder=""
                value={state.formData.doctor}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
          </div>

          {/* Appointment and Payment Column */}
          <div>
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
                value={state.formData.dateTime}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>

            <div className="space-y-2 mb-4">
              <Label
                htmlFor="paymentMode"
                className="flex items-center gap-2 text-[#018a8c]"
              >
                <Mail className="h-4 w-4" /> Paiement
              </Label>
              <Select
                onValueChange={handlePaymentMethodChange}
                value={state.paymentMethod}
              >
                <SelectTrigger className={styles.input}>
                  <SelectValue placeholder="Mode de paiement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Espèces">Espèces</SelectItem>
                  <SelectItem value="Enligne">En ligne</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {state.paymentMethod === "Espèces" && (
              <div className="space-y-2">
                <Label htmlFor="fees" className="text-[#018a8c]">
                  Frais (FCFA)
                </Label>
                <Input
                  id="fees"
                  type="number"
                  placeholder="Entrez les frais"
                  value={state.formData.fees}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                />
              </div>
            )}

            {state.paymentMethod === "Enligne" && (
              <div className="space-y-2">
                <Label htmlFor="transactionId" className="text-[#018a8c]">
                  ID. Transaction
                </Label>
                <Input
                  id="transactionId"
                  placeholder="Entrez l'ID de la transaction"
                  value={state.formData.transactionId}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button
            variant="outline"
            className="border-[#018a8c] text-[#018a8c] hover:bg-[#018a8c] hover:text-white"
            onClick={handleCancel}
          >
            Annuler
          </Button>
          <Button className={styles.button} onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            {state.isEditing ? "Mettre à jour" : "Enregistrer"}
          </Button>
        </CardFooter>
      </Card>

      {/* Patients Table */}
      <Card className={styles.card}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#018a8c]">
            Liste des Patients
          </CardTitle>
          <div className="pt-4">
            <Input
              placeholder="Rechercher par nom, UHID ou numéro de file..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Liste des patients enregistrés</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">File d'attente</TableHead>
                <TableHead className="text-center">UHID</TableHead>
                <TableHead>Nom Patient</TableHead>
                <TableHead>Département</TableHead>
                <TableHead>Médecin</TableHead>
                <TableHead>Frais</TableHead>
                <TableHead>Mode Paiement</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="text-center">{patient.queue}</TableCell>
                  <TableCell className="text-center">{patient.uhid}</TableCell>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.department}</TableCell>
                  <TableCell>{patient.doctor}</TableCell>
                  <TableCell>{patient.fees || "Non spécifié"}</TableCell>
                  <TableCell>{patient.paymentMode}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#018a8c] hover:text-[#016a6c]"
                      onClick={() => handleUpdate(patient)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(patient.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <PDFDownloadLink
                      document={
                        <PaymentPDF patient={preparePatientForPDF(patient)} />
                      }
                      fileName={`facture_${patient.name}_${patient.id}.pdf`}
                      className="ml-2 inline-block"
                    >
                      {({ loading }) => (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={loading}
                          className="text-[#018a8c] hover:text-[#016a6c]"
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                      )}
                    </PDFDownloadLink>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  Total Patients: {state.patients.length}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(state.currentPage - 1)}
                  className="text-[#018a8c] hover:text-[#016a6c]"
                  disabled={state.currentPage === 1}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    onClick={() => handlePageChange(index + 1)}
                    isActive={state.currentPage === index + 1}
                    className="text-[#018a8c] hover:text-[#016a6c]"
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(state.currentPage + 1)}
                  className="text-[#018a8c] hover:text-[#016a6c]"
                  disabled={state.currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </Card>
    </div>
  );
}
