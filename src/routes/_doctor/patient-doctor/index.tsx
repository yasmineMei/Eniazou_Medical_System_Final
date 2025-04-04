import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Eye, Trash2, PlusCircle } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Patient } from "@/types/patient";
import { patientsData } from "@/data/patients";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

export const Route = createFileRoute("/_doctor/patient-doctor/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null);
  const [patients, setPatients] = useState<Patient[]>(patientsData);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filtrer les patients selon la recherche
  const filteredPatients = patients.filter((patient) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      patient.nom.toLowerCase().includes(searchTerm) ||
      patient.prenom.toLowerCase().includes(searchTerm) ||
      patient.dossierMedical.toLowerCase().includes(searchTerm)
    );
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPatients = filteredPatients.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Supprimer un patient
  const handleDeletePatient = (id: string) => {
    setPatients(patients.filter((patient) => patient.id !== id));
    setDeleteDialogOpen(false);
    // Reset à la première page si nécessaire
    if (currentPatients.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  return (
    <div className="flex flex-col h-full p-6">
      {/* En-tête avec titre et bouton d'ajout */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#018a8c]">
          Liste des Patients
        </h1>
        <Link to="/create-record">
          <Button className="bg-[#018a8c] hover:bg-[#016a6c]">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouveau Patient
          </Button>
        </Link>
      </div>

      {/* Barre de recherche */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, prénom ou numéro de dossier..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset à la première page lors d'une nouvelle recherche
            }}
          />
        </div>
      </div>

      {/* Tableau des patients */}
      <Card>
        <CardHeader>
          <CardTitle>Patients enregistrés</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead>N° Dossier</TableHead>
                <TableHead>Date de naissance</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPatients.length > 0 ? (
                currentPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>{patient.nom}</TableCell>
                    <TableCell>{patient.prenom}</TableCell>
                    <TableCell>{patient.dossierMedical}</TableCell>
                    <TableCell>{formatDate(patient.birthDate)}</TableCell>
                    <TableCell>{patient.genre}</TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <Link
                        to="/patient-doctor/$patientId"
                        params={{ patientId: patient.id }}
                      >
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                      </Link>
                      <Dialog
                        open={
                          deleteDialogOpen && patientToDelete === patient.id
                        }
                        onOpenChange={(open) => {
                          if (!open) setPatientToDelete(null);
                          setDeleteDialogOpen(open);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setPatientToDelete(patient.id);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Supprimer
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirmer la suppression</DialogTitle>
                          </DialogHeader>
                          <p className="text-sm text-muted-foreground">
                            Êtes-vous sûr de vouloir supprimer le dossier de{" "}
                            {patient.nom} {patient.prenom} ? Cette action est
                            irréversible.
                          </p>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setDeleteDialogOpen(false)}
                            >
                              Annuler
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDeletePatient(patient.id)}
                            >
                              Confirmer la suppression
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    {searchQuery
                      ? "Aucun patient trouvé avec ces critères"
                      : "Aucun patient enregistré"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {filteredPatients.length > itemsPerPage && (
            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => paginate(currentPage - 1)}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {/* Affichage des numéros de page */}
                  {Array.from({ length: totalPages }).map((_, index) => {
                    // Pour ne pas afficher toutes les pages si trop nombreuses
                    if (
                      index === 0 ||
                      index === totalPages - 1 ||
                      (index >= currentPage - 2 && index <= currentPage + 2)
                    ) {
                      return (
                        <PaginationItem key={index}>
                          <PaginationLink
                            onClick={() => paginate(index + 1)}
                            isActive={currentPage === index + 1}
                            className="cursor-pointer"
                          >
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (
                      (index === 1 && currentPage > 4) ||
                      (index === totalPages - 2 && currentPage < totalPages - 3)
                    ) {
                      return <PaginationItem key={index}>...</PaginationItem>;
                    }
                    return null;
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => paginate(currentPage + 1)}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
