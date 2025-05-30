import { createFileRoute } from "@tanstack/react-router";
import {
  Calendar1,
  CalendarDays,
  Clock,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_home/patient")({
  component: RouteComponent,
});

type Patient = {
  id: number;
  nom: string;
  prenom: string;
  numberPhone: string;
  dateEnregistrement: string;
  birthdate: string;
  genre: "M" | "F";
  numeroDossier: string;
  status: "actif" | "inactif";
};

function RouteComponent() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isAddPatientDialogOpen, setIsAddPatientDialogOpen] =
    useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: 1,
      nom: "Traoré",
      prenom: "Fatou",
      numberPhone: "07 89 45 12 36",
      dateEnregistrement: "2024-02-10",
      birthdate: "1990-05-15",
      genre: "F",
      numeroDossier: "DM1123",
      status: "actif",
    },
    {
      id: 2,
      nom: "Kouamé",
      prenom: "Paul",
      numberPhone: "01 45 78 96 32",
      dateEnregistrement: "2024-01-05",
      birthdate: "1985-08-20",
      genre: "M",
      numeroDossier: "DM2234",
      status: "inactif",
    },
    {
      id: 3,
      nom: "Bamba",
      prenom: "Aïcha",
      numberPhone: "05 78 96 32 14",
      dateEnregistrement: "2024-03-01",
      birthdate: "1995-12-01",
      genre: "F",
      numeroDossier: "DM3345",
      status: "actif",
    },
    {
      id: 4,
      nom: "Konaté",
      prenom: "Moussa",
      numberPhone: "01 23 65 98 74",
      dateEnregistrement: "2024-02-28",
      birthdate: "1988-11-30",
      genre: "M",
      numeroDossier: "DM4456",
      status: "actif",
    },
  ]);

  // État pour le formulaire d'ajout
  const [formData, setFormData] = useState<Omit<Patient, "id">>({
    nom: "",
    prenom: "",
    numberPhone: "",
    dateEnregistrement: new Date().toISOString().split("T")[0],
    birthdate: "",
    genre: "M",
    numeroDossier: "",
    status: "actif",
  });

  // Calculer l'âge à partir de la date de naissance
  const calculateAge = (birthdate: string): number => {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Supprimer un patient
  const handleDeletePatient = (id: number) => {
    setPatients(patients.filter((patient) => patient.id !== id));
  };

  // Gérer les changements dans les inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Gérer les changements dans les selects
  const handleSelectChange = (field: keyof Patient, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Soumettre le formulaire
  const handleSubmit = () => {
    // Validation
    if (
      !formData.nom ||
      !formData.prenom ||
      !formData.numeroDossier ||
      !formData.birthdate
    ) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Créer un nouveau patient avec un ID unique
    const newPatient: Patient = {
      ...formData,
      id: patients.length > 0 ? Math.max(...patients.map((p) => p.id)) + 1 : 1,
    };

    // Ajouter le nouveau patient
    setPatients([...patients, newPatient]);

    // Réinitialiser le formulaire
    setFormData({
      nom: "",
      prenom: "",
      numberPhone: "",
      dateEnregistrement: new Date().toISOString().split("T")[0],
      birthdate: "",
      genre: "M",
      numeroDossier: "",
      status: "actif",
    });

    // Fermer le modal
    setIsAddPatientDialogOpen(false);
  };

  // Filtrer les patients
  const filteredPatients = patients.filter(
    (patient) =>
      patient.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.numeroDossier.includes(searchQuery)
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPatients = filteredPatients.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  // Cartes de statistiques
  const statsCards = [
    {
      title: "Patients actifs",
      value: patients.filter((p) => p.status === "actif").length.toString(),
      description: "Patients ayant consulté récemment",
      icon: <Clock className="h-8 w-8 text-[#018a8cff]" />,
      bgColor: "from-green-50 to-green-100",
    },
    {
      title: "Nouveaux patients (30j)",
      value: patients
        .filter((p) => {
          const registrationDate = new Date(p.dateEnregistrement);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return registrationDate >= thirtyDaysAgo;
        })
        .length.toString(),
      description: "Nouveaux inscrits ce mois-ci",
      icon: <Calendar1 className="h-8 w-8 text-[#018a8cff]" />,
      bgColor: "from-blue-50 to-blue-100",
    },
    {
      title: "Patients inactifs",
      value: patients.filter((p) => p.status === "inactif").length.toString(),
      description: "N'ont pas consulté depuis 3 mois",
      icon: <CalendarDays className="h-8 w-8 text-[#018a8cff]" />,
      bgColor: "from-orange-50 to-orange-100",
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Patients inscrits</h1>
        <Button
          onClick={() => setIsAddPatientDialogOpen(true)}
          className="bg-[#018a8cff] hover:bg-[#017a7cff] text-white"
        >
          Nouveau Patient
        </Button>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        {statsCards.map((card, index) => (
          <motion.div whileHover={{ scale: 1.03 }} key={index}>
            <Card className={`bg-gradient-to-br ${card.bgColor}`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Barre de recherche et pagination */}
      <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Rechercher par nom, prénom ou numéro de dossier..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full max-w-md"
          />
          {searchQuery && (
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Effacer
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Patients par page:
          </span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder={itemsPerPage} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tableau des patients */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom complet</TableHead>
                <TableHead>Date enregistrement</TableHead>
                <TableHead>Âge</TableHead>
                <TableHead>Numéro dossier</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPatients.length > 0 ? (
                currentPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      {patient.nom} {patient.prenom}
                    </TableCell>
                    <TableCell>{patient.dateEnregistrement}</TableCell>
                    <TableCell>{calculateAge(patient.birthdate)} ans</TableCell>
                    <TableCell>{patient.numeroDossier}</TableCell>
                    <TableCell>
                      {patient.genre === "M" ? "Masculin" : "Féminin"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          patient.status === "actif" ? "default" : "secondary"
                        }
                        className={
                          patient.status === "actif"
                            ? "bg-green-500"
                            : "bg-gray-500"
                        }
                      >
                        {patient.status === "actif" ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedPatient(patient);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeletePatient(patient.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Aucun patient trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {filteredPatients.length > 0 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            Affichage de {indexOfFirstItem + 1} à{" "}
            {Math.min(indexOfLastItem, filteredPatients.length)} sur{" "}
            {filteredPatients.length} patients
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageToShow;
                if (totalPages <= 5) {
                  pageToShow = i + 1;
                } else if (currentPage <= 3) {
                  pageToShow = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageToShow = totalPages - 4 + i;
                } else {
                  pageToShow = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageToShow}
                    variant={currentPage === pageToShow ? "default" : "outline"}
                    size="sm"
                    onClick={() => paginate(pageToShow)}
                  >
                    {pageToShow}
                  </Button>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="px-2">...</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => paginate(totalPages)}
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Modal pour afficher les détails du patient */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Détails du patient : {selectedPatient?.nom}{" "}
              {selectedPatient?.prenom}
            </DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p>
                  <strong>Nom complet :</strong> {selectedPatient.nom}{" "}
                  {selectedPatient.prenom}
                </p>
                <p>
                  <strong>Date d'enregistrement :</strong>{" "}
                  {selectedPatient.dateEnregistrement}
                </p>
                <p>
                  <strong>Âge :</strong>{" "}
                  {calculateAge(selectedPatient.birthdate)} ans
                </p>
                <p>
                  <strong>Genre :</strong>{" "}
                  {selectedPatient.genre === "M" ? "Masculin" : "Féminin"}
                </p>
              </div>
              <div className="space-y-2">
                <p>
                  <strong>Numéro de téléphone :</strong>{" "}
                  {selectedPatient.numberPhone}
                </p>
                <p>
                  <strong>Numéro de dossier :</strong>{" "}
                  {selectedPatient.numeroDossier}
                </p>
                <p>
                  <strong>Date de naissance :</strong>{" "}
                  {selectedPatient.birthdate}
                </p>
                <p>
                  <strong>Statut :</strong>
                  <Badge
                    variant={
                      selectedPatient.status === "actif"
                        ? "default"
                        : "secondary"
                    }
                    className={`ml-2 ${selectedPatient.status === "actif" ? "bg-green-500" : "bg-gray-500"}`}
                  >
                    {selectedPatient.status === "actif" ? "Actif" : "Inactif"}
                  </Badge>
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal pour ajouter un nouveau patient */}
      <Dialog
        open={isAddPatientDialogOpen}
        onOpenChange={setIsAddPatientDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Inscrire un nouveau patient</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="nom" className="block text-sm font-medium mb-1">
                  Nom*
                </label>
                <Input
                  id="nom"
                  placeholder="Entrez le nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="prenom"
                  className="block text-sm font-medium mb-1"
                >
                  Prénom*
                </label>
                <Input
                  id="prenom"
                  placeholder="Entrez le prénom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="birthdate"
                  className="block text-sm font-medium mb-1"
                >
                  Date de naissance*
                </label>
                <Input
                  id="birthdate"
                  type="date"
                  value={formData.birthdate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="genre"
                  className="block text-sm font-medium mb-1"
                >
                  Genre*
                </label>
                <Select
                  value={formData.genre}
                  onValueChange={(value) => handleSelectChange("genre", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez le genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculin</SelectItem>
                    <SelectItem value="F">Féminin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="numberPhone"
                  className="block text-sm font-medium mb-1"
                >
                  Téléphone
                </label>
                <Input
                  id="numberPhone"
                  placeholder="Entrez le numéro de téléphone"
                  value={formData.numberPhone}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label
                  htmlFor="numeroDossier"
                  className="block text-sm font-medium mb-1"
                >
                  Numéro de dossier*
                </label>
                <Input
                  id="numeroDossier"
                  placeholder="Entrez le numéro de dossier"
                  value={formData.numeroDossier}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="dateEnregistrement"
                  className="block text-sm font-medium mb-1"
                >
                  Date d'enregistrement
                </label>
                <Input
                  id="dateEnregistrement"
                  type="date"
                  value={formData.dateEnregistrement}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium mb-1"
                >
                  Statut*
                </label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="actif">Actif</SelectItem>
                    <SelectItem value="inactif">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAddPatientDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button
              className="bg-[#018a8cff] hover:bg-[#017a7cff]"
              onClick={handleSubmit}
            >
              Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default RouteComponent;