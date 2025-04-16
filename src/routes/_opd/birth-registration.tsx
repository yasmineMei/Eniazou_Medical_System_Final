"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { createFileRoute } from "@tanstack/react-router";
import {
  Baby,
  Calendar,
  Heart,
  MapPin,
  Phone,
  Save,
  Search,
  User,
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
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";


// Types pour les données du nouveau-né
type NewBorn = {
  id: number;
  namebaby: string;
  nameMother: string;
  gender: string;
  dob: string;
  hour: string;
  resident: string;
  doctor: string;
  lenght: string;
  weight: string;
  headCircle: string;
  bloodGroup: string;
  phone: string;
};

export const Route = createFileRoute("/_opd/birth-registration")({
  component: RouteComponent,
});

function RouteComponent() {
  const [formData, setFormData] = useState<NewBorn>({
    id: 0,
    namebaby: "",
    nameMother: "",
    gender: "",
    dob: "",
    hour: "",
    resident: "",
    doctor: "",
    lenght: "",
    weight: "",
    headCircle: "",
    bloodGroup: "",
    phone: "",
  });

  const [newBorns, setNewBorns] = useState<NewBorn[]>([]); // Liste des nouveau-nés
  const [currentPage, setCurrentPage] = useState(1); // Pagination
  const itemsPerPage = 5; // Nombre d'éléments par page

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: keyof NewBorn, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    // Validation des champs obligatoires
    const requiredFields: (keyof NewBorn)[] = [
      "namebaby",
      "nameMother",
      "gender",
      "dob",
      "hour",
      "doctor",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      alert(
        `Veuillez remplir les champs obligatoires: ${missingFields.join(", ")}`
      );
      return;
    }

    // Ajouter le nouveau-né à la liste
    const newBorn = { ...formData, id: newBorns.length + 1 };
    setNewBorns((prev) => [...prev, newBorn]);

    // Réinitialiser le formulaire
    setFormData({
      id: 0,
      namebaby: "",
      nameMother: "",
      gender: "",
      dob: "",
      hour: "",
      resident: "",
      doctor: "",
      lenght: "",
      weight: "",
      headCircle: "",
      bloodGroup: "",
      phone: "",
    });

    alert("Nouveau-né enregistré avec succès !");
  };

  

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNewBorns = newBorns.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 space-y-6 bg-gradient-to-r from-blue-50 to-purple-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#018a8c] to-[#016a6c]">
          Enregistrement des nouveau-nés
        </h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#018a8c]">
            Informations du nouveau-né
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/** Informations du bébé */}
          <div>
            {/* Nom du bébé */}
            <div className="space-y-2 mb-4">
              <Label
                htmlFor="namebaby"
                className="flex items-center gap-2 text-[#018a8c]"
              >
                <Baby className="h-4 w-4" /> Nom du bébé
              </Label>
              <Input
                id="namebaby"
                placeholder="Entrer le nom du bébé"
                value={formData.namebaby}
                onChange={handleInputChange}
                className="border-[#018a8c] focus:border-[#016a6c]"
              />
            </div>

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

            {/* Heure de naissance */}
            <div className="space-y-2 mb-4">
              <Label
                htmlFor="hour"
                className="flex items-center gap-2 text-[#018a8c]"
              >
                <Calendar className="h-4 w-4" /> Heure de naissance
              </Label>
              <Input
                id="hour"
                type="time"
                value={formData.hour}
                onChange={handleInputChange}
                className="border-[#018a8c] focus:border-[#016a6c]"
              />
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
                  <SelectItem value="Male">Masculin</SelectItem>
                  <SelectItem value="Female">Féminin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Groupe sanguin */}
            <div className="space-y-2 mb-4">
              <Label
                htmlFor="bloodGroup"
                className="flex items-center gap-2 text-[#018a8c]"
              >
                <Heart className="h-4 w-4" /> Groupe sanguin
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
          </div>

          {/** Informations médicales */}
          <div>
            {/* Médecin */}
            <div className="space-y-2 mb-4">
              <Label
                htmlFor="doctor"
                className="flex items-center gap-2 text-[#018a8c]"
              >
                <User className="h-4 w-4" /> Médecin
              </Label>
              <Input
                id="doctor"
                placeholder="Entrer le nom du médecin"
                value={formData.doctor}
                onChange={handleInputChange}
                className="border-[#018a8c] focus:border-[#016a6c]"
              />
            </div>

            {/* Longueur */}
            <div className="space-y-2 mb-4">
              <Label
                htmlFor="lenght"
                className="flex items-center gap-2 text-[#018a8c]"
              >
                <Search className="h-4 w-4" /> Longueur (cm)
              </Label>
              <Input
                id="lenght"
                placeholder="Entrer la longueur"
                value={formData.lenght}
                onChange={handleInputChange}
                className="border-[#018a8c] focus:border-[#016a6c]"
              />
            </div>

            {/* Poids */}
            <div className="space-y-2 mb-4">
              <Label
                htmlFor="weight"
                className="flex items-center gap-2 text-[#018a8c]"
              >
                <Heart className="h-4 w-4" /> Poids (kg)
              </Label>
              <Input
                id="weight"
                placeholder="Entrer le poids"
                value={formData.weight}
                onChange={handleInputChange}
                className="border-[#018a8c] focus:border-[#016a6c]"
              />
            </div>

            {/* Périmètre crânien */}
            <div className="space-y-2 mb-4">
              <Label
                htmlFor="headCircle"
                className="flex items-center gap-2 text-[#018a8c]"
              >
                <Heart className="h-4 w-4" /> Périmètre crânien (cm)
              </Label>
              <Input
                id="headCircle"
                placeholder="Entrer le périmètre crânien"
                value={formData.headCircle}
                onChange={handleInputChange}
                className="border-[#018a8c] focus:border-[#016a6c]"
              />
            </div>
          </div>

          {/** Informations de la mère */}
          <div>
            {/* Nom de la mère */}
            <div className="space-y-2 mb-4">
              <Label
                htmlFor="nameMother"
                className="flex items-center gap-2 text-[#018a8c]"
              >
                <User className="h-4 w-4" /> Nom de la mère
              </Label>
              <Input
                id="nameMother"
                placeholder="Entrer le nom de la mère"
                value={formData.nameMother}
                onChange={handleInputChange}
                className="border-[#018a8c] focus:border-[#016a6c]"
              />
            </div>

            {/* Résidence */}
            <div className="space-y-2 mb-4">
              <Label
                htmlFor="resident"
                className="flex items-center gap-2 text-[#018a8c]"
              >
                <MapPin className="h-4 w-4" /> Résidence
              </Label>
              <Input
                id="resident"
                placeholder="Entrer la résidence"
                value={formData.resident}
                onChange={handleInputChange}
                className="border-[#018a8c] focus:border-[#016a6c]"
              />
            </div>

            {/* Numéro de téléphone */}
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

      {/* Tableau des Naissances */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#018a8c]">
            Liste des naissances enregistrées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Liste des nouveau-nés enregistrés</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">S.No</TableHead>
                <TableHead className="text-center">Nom du bébé</TableHead>
                <TableHead className="text-center">Mère</TableHead>
                <TableHead className="text-center">
                  Date et Heure de naissance
                </TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>Longueur</TableHead>
                <TableHead>Poids</TableHead>
                <TableHead>P.Cranien</TableHead>
                <TableHead>Médecin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentNewBorns.map((newBorn) => (
                <TableRow key={newBorn.id}>
                  <TableCell className="text-center">{newBorn.id}</TableCell>
                  <TableCell className="text-center">
                    {newBorn.namebaby}
                  </TableCell>
                  <TableCell className="text-center">
                    {newBorn.nameMother}
                  </TableCell>
                  <TableCell className="text-center">
                    {newBorn.dob} {newBorn.hour}
                  </TableCell>
                  <TableCell>{newBorn.gender}</TableCell>
                  <TableCell>{newBorn.lenght} cm</TableCell>
                  <TableCell>{newBorn.weight} kg</TableCell>
                  <TableCell>{newBorn.headCircle} cm</TableCell>
                  <TableCell>{newBorn.doctor}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={11} className="text-center">
                  Total Naissances: {newBorns.length}
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
              length: Math.ceil(newBorns.length / itemsPerPage),
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
                  currentPage === Math.ceil(newBorns.length / itemsPerPage)
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </Card>
    </div>
  );
}
