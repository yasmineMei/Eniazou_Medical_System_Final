"use client";

import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, Edit, Trash, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Données fictives pour les services médicaux
const initialServices = [
  {
    id: 1,
    name: "Consultation générale",
    category: "Consultation",
    description: "Consultation avec un médecin généraliste.",
    price: "50 €",
    duration: "30 min",
    status: "active",
  },
  {
    id: 2,
    name: "Radiographie",
    category: "Radiologie",
    description: "Examen radiologique standard.",
    price: "120 €",
    duration: "45 min",
    status: "active",
  },
  {
    id: 3,
    name: "Chirurgie dentaire",
    category: "Chirurgie",
    description: "Extraction dentaire ou soins dentaires.",
    price: "200 €",
    duration: "1 heure",
    status: "inactive",
  },
];

// Composant pour le formulaire d'ajout/modification
function ServiceForm({ service, onSave, onCancel }) {
  const [name, setName] = useState(service?.name || "");
  const [category, setCategory] = useState(service?.category || "");
  const [description, setDescription] = useState(service?.description || "");
  const [price, setPrice] = useState(service?.price || "");
  const [duration, setDuration] = useState(service?.duration || "");
  const [status, setStatus] = useState(service?.status || "active");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: service?.id,
      name,
      category,
      description,
      price,
      duration,
      status,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Nom du service</Label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label>Catégorie</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Consultation">Consultation</SelectItem>
            <SelectItem value="Radiologie">Radiologie</SelectItem>
            <SelectItem value="Chirurgie">Chirurgie</SelectItem>
            <SelectItem value="Laboratoire">Laboratoire</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Description</Label>
        <Input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <Label>Tarif</Label>
        <Input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>
      <div>
        <Label>Durée</Label>
        <Input
          type="text"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />
      </div>
      <div>
        <Label>Statut</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="inactive">Inactif</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" className="bg-[#018a8cff] hover:bg-[#016a6cff]">
          Enregistrer
        </Button>
      </DialogFooter>
    </form>
  );
}

// Composant principal de la page
function ServicesPage() {
  const [services, setServices] = useState(initialServices);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Filtrer les services en fonction de la recherche
  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Gérer l'ajout ou la modification d'un service
  const handleSaveService = (service) => {
    if (isEditing) {
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? service : s))
      );
    } else {
      setServices((prev) => [...prev, { ...service, id: prev.length + 1 }]);
    }
    setIsDialogOpen(false);
    setSelectedService(null);
  };

  // Supprimer un service
  const handleDeleteService = (id) => {
    setServices((prev) => prev.filter((service) => service.id !== id));
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <h1 className="text-2xl font-bold">Services médicaux</h1>

      {/* Barre de recherche et bouton d'ajout */}
      <div className="flex justify-between items-center">
        <Input
          type="text"
          placeholder="Rechercher un service..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md"
        />
        <Button
          onClick={() => {
            setSelectedService(null);
            setIsEditing(false);
            setIsDialogOpen(true);
          }}
          className="bg-[#018a8cff] hover:bg-[#016a6cff]"
        >
          <Plus className="mr-2 h-4 w-4" /> Ajouter un service
        </Button>
      </div>

      {/* Tableau des services */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Tarif</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{service.category}</TableCell>
                  <TableCell>{service.price}</TableCell>
                  <TableCell>{service.duration}</TableCell>
                  <TableCell>
                    {service.status === "active" ? (
                      <CheckCircle className="text-green-500" />
                    ) : (
                      <XCircle className="text-red-500" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedService(service);
                        setIsEditing(true);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-2"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal pour ajouter/modifier un service */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Modifier un service" : "Ajouter un service"}
            </DialogTitle>
          </DialogHeader>
          <ServiceForm
            service={selectedService}
            onSave={handleSaveService}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Définir la route
export const Route = createFileRoute("/_home/service")({
  component: ServicesPage,
});
