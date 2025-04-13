"use client";

import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label"; // Correction de l'import

type MedicalService = {
  id: string;
  code: string;
  name: string;
  department: string;
  price: number;
  duration: number;
  category: string;
  notes?: string;
};

export const Route = createFileRoute("/_appointments/clinic-tarif")({
  component: TarifsMedicauxPage,
});

function TarifsMedicauxPage() {
  const [services, setServices] = useState<MedicalService[]>([]);
  const [filteredServices, setFilteredServices] = useState<MedicalService[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<MedicalService>>(
    {
      duration: 0,
      price: 0,
    }
  );
  const servicesPerPage = 10;

  // Données de démonstration
  useEffect(() => {
    const demoData: MedicalService[] = [
      {
        id: "1",
        code: "CONS-OPHT",
        name: "Consultation Ophtalmologie",
        department: "Ophtalmologie",
        price: 25000,
        duration: 30,
        category: "Consultation",
      },
      {
        id: "2",
        code: "ECHO-ABD",
        name: "Échographie Abdominale",
        department: "Radiologie",
        price: 45000,
        duration: 45,
        category: "Imagerie",
      },
      {
        id: "3",
        code: "ANES-LOC",
        name: "Anesthésie Locale",
        department: "Chirurgie",
        price: 15000,
        duration: 15,
        category: "Anesthésie",
      },
      {
        id: "4",
        code: "BIO-SANG",
        name: "Bilan Biochimique Sanguin",
        department: "Laboratoire",
        price: 18000,
        duration: 0,
        category: "Biologie",
      },
      {
        id: "5",
        code: "CONS-PED",
        name: "Consultation Pédiatrie",
        department: "Pédiatrie",
        price: 20000,
        duration: 25,
        category: "Consultation",
      },
    ];

    setServices(demoData);
    setFilteredServices(demoData);
  }, []);

  // Filtrage des services
  useEffect(() => {
    const filtered = services.filter(
      (service) =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredServices(filtered);
    setCurrentPage(1);
  }, [searchTerm, services]);

  // Pagination
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = filteredServices.slice(
    indexOfFirstService,
    indexOfLastService
  );
  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);

  // Catégories et départements
  const categories = [
    "Consultation",
    "Imagerie",
    "Biologie",
    "Chirurgie",
    "Anesthésie",
    "Hospitalisation",
    "Urgences",
    "Autre",
  ];

  const departments = [
    "Ophtalmologie",
    "Radiologie",
    "Chirurgie",
    "Laboratoire",
    "Pédiatrie",
    "Maternité",
    "Cardiologie",
    "Urgences",
  ];

  const openNewServiceDialog = () => {
    setCurrentService({
      duration: 0,
      price: 0,
      category: "Consultation",
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (service: MedicalService) => {
    setCurrentService({ ...service });
    setIsDialogOpen(true);
  };

  const saveService = () => {
    if (
      !currentService.name ||
      !currentService.price ||
      !currentService.department
    ) {
      alert(
        "Veuillez remplir les champs obligatoires (Nom, Tarif et Département)"
      );
      return;
    }

    const newService: MedicalService = {
      id: currentService.id || `svc-${Date.now()}`,
      code: currentService.code || "",
      name: currentService.name,
      department: currentService.department,
      price: Number(currentService.price),
      duration: Number(currentService.duration || 0),
      category: currentService.category || "Autre",
      notes: currentService.notes,
    };

    setServices(
      currentService.id
        ? services.map((svc) =>
            svc.id === currentService.id ? newService : svc
          )
        : [...services, newService]
    );
    setIsDialogOpen(false);
  };

  const deleteService = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
      setServices(services.filter((service) => service.id !== id));
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
    }).format(price);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-[#018787]">Tarifs Médicaux</h1>

        <div className="flex items-center gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button onClick={openNewServiceDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un tarif
          </Button>
        </div>
      </div>

      <div className="rounded-md border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-[#018787]">
            <TableRow>
              <TableHead className="text-white">Code</TableHead>
              <TableHead className="text-white">Service</TableHead>
              <TableHead className="text-white">Département</TableHead>
              <TableHead className="text-white">Catégorie</TableHead>
              <TableHead className="text-white text-right">Tarif</TableHead>
              <TableHead className="text-white">Durée</TableHead>
              <TableHead className="text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentServices.length > 0 ? (
              currentServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.code}</TableCell>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{service.department}</TableCell>
                  <TableCell>{service.category}</TableCell>
                  <TableCell className="text-right">
                    {formatPrice(service.price)}
                  </TableCell>
                  <TableCell>
                    {service.duration > 0 ? `${service.duration} min` : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditDialog(service)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => deleteService(service.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  Aucun service trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filteredServices.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Affichage de {indexOfFirstService + 1} à{" "}
            {Math.min(indexOfLastService, filteredServices.length)} sur{" "}
            {filteredServices.length} services
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              Page {currentPage} sur {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentService.id ? "Modifier le tarif" : "Nouveau tarif"}
            </DialogTitle>
            <DialogDescription>
              Remplissez les détails du service médical
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service-code" className="text-right">
                Code
              </Label>
              <Input
                id="service-code"
                value={currentService.code || ""}
                onChange={(e) =>
                  setCurrentService({ ...currentService, code: e.target.value })
                }
                className="col-span-3"
                placeholder="Ex: CONS-OPHT"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service-name" className="text-right">
                Nom
              </Label>
              <Input
                id="service-name"
                value={currentService.name || ""}
                onChange={(e) =>
                  setCurrentService({ ...currentService, name: e.target.value })
                }
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service-department" className="text-right">
                Département
              </Label>
              <Select
                value={currentService.department || ""}
                onValueChange={(value) =>
                  setCurrentService({ ...currentService, department: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un département" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service-category" className="text-right">
                Catégorie
              </Label>
              <Select
                value={currentService.category || ""}
                onValueChange={(value) =>
                  setCurrentService({ ...currentService, category: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service-price" className="text-right">
                Tarif (FCFA)
              </Label>
              <Input
                id="service-price"
                type="number"
                value={currentService.price || ""}
                onChange={(e) =>
                  setCurrentService({
                    ...currentService,
                    price: Number(e.target.value),
                  })
                }
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service-duration" className="text-right">
                Durée (min)
              </Label>
              <Input
                id="service-duration"
                type="number"
                value={currentService.duration || ""}
                onChange={(e) =>
                  setCurrentService({
                    ...currentService,
                    duration: Number(e.target.value),
                  })
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service-notes" className="text-right">
                Notes
              </Label>
              <Input
                id="service-notes"
                value={currentService.notes || ""}
                onChange={(e) =>
                  setCurrentService({
                    ...currentService,
                    notes: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={saveService}>
              {currentService.id ? "Enregistrer" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
