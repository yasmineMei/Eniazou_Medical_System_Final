import { createFileRoute } from "@tanstack/react-router";
import {
  Calendar1,
  CalendarDays,
  Clock,
  Eye,
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
  age: number;
  status: "actif" | "inactif";
  derniereVisite?: string;
};

function RouteComponent() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  // Données fictives pour les patients
  const patients: Patient[] = [
    // ... (vos données patients existantes)
    // J'ai ajouté plus de données pour tester la pagination
    {
      id: 5,
      nom: "Traoré",
      prenom: "Fatou",
      numberPhone: "07 89 45 12 36",
      dateEnregistrement: "2024-02-10",
      age: 25,
      status: "actif",
      derniereVisite: "2024-03-20",
    },
    {
      id: 6,
      nom: "Kouamé",
      prenom: "Paul",
      numberPhone: "01 45 78 96 32",
      dateEnregistrement: "2024-01-05",
      age: 40,
      status: "inactif",
      derniereVisite: "2024-01-15",
    },
    {
      id: 7,
      nom: "Bamba",
      prenom: "Aïcha",
      numberPhone: "05 78 96 32 14",
      dateEnregistrement: "2024-03-01",
      age: 32,
      status: "actif",
      derniereVisite: "2024-03-18",
    },
    {
      id: 8,
      nom: "Konaté",
      prenom: "Moussa",
      numberPhone: "01 23 65 98 74",
      dateEnregistrement: "2024-02-28",
      age: 45,
      status: "actif",
      derniereVisite: "2024-03-15",
    },
  ];

  // Filtrer les patients en fonction de la recherche
  const filteredPatients = patients.filter(
    (patient) =>
      patient.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.numberPhone.includes(searchQuery)
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
      value: "12",
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
      <h1 className="text-2xl font-bold">Patients inscrits</h1>

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

      {/* Barre de recherche et sélection d'items par page */}
      <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Rechercher par nom, prénom ou téléphone..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset à la première page lors d'une nouvelle recherche
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
              setCurrentPage(1); // Reset à la première page lors du changement d'items par page
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
                <TableHead>Téléphone</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dernière visite</TableHead>
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
                    <TableCell>{patient.age} ans</TableCell>
                    <TableCell>{patient.numberPhone}</TableCell>
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
                    <TableCell>{patient.derniereVisite || "N/A"}</TableCell>
                    <TableCell>
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
                // Affiche seulement 5 pages max autour de la page courante
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
                  <strong>Âge :</strong> {selectedPatient.age} ans
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
              <div className="space-y-2">
                <p>
                  <strong>Numéro de téléphone :</strong>{" "}
                  {selectedPatient.numberPhone}
                </p>
                <p>
                  <strong>Dernière visite :</strong>{" "}
                  {selectedPatient.derniereVisite || "N/A"}
                </p>
                <p>
                  <strong>Inscrit depuis :</strong>
                  {Math.floor(
                    (new Date().getTime() -
                      new Date(selectedPatient.dateEnregistrement).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  jours
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}


