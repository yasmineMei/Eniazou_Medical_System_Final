import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Pencil, Trash2, Loader2 } from "lucide-react";

// Types pour les données
type Supplier = {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  type: "medicament" | "materiel" | "both";
  status: "active" | "inactive";
  products: string[];
};

export const Route = createFileRoute("/_medical-stock/fournisseur")({
  component: SuppliersPage,
});

function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Charger les fournisseurs
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        // Simulation d'appel API
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Données mockées
        const mockData: Supplier[] = [
          {
            id: "sup-001",
            name: "PharmaPlus",
            contact: "Jean Dupont",
            phone: "01 23 45 67 89",
            email: "contact@pharmaplus.fr",
            address: "12 rue de la Santé, 75013 Paris",
            type: "medicament",
            status: "active",
            products: ["Paracétamol", "Ibuprofène"],
          },
          {
            id: "sup-002",
            name: "MediSupply",
            contact: "Marie Martin",
            phone: "04 56 78 90 12",
            email: "commande@medisupply.fr",
            address: "45 avenue des Hôpitaux, 69003 Lyon",
            type: "materiel",
            status: "active",
            products: ["Gants stériles", "Masques chirurgicaux"],
          },
          {
            id: "sup-003",
            name: "BioHealth",
            contact: "Thomas Leroy",
            phone: "05 67 89 01 23",
            email: "info@biohealth.fr",
            address: "8 boulevard Pasteur, 31000 Toulouse",
            type: "both",
            status: "inactive",
            products: ["Bandages", "Antiseptique"],
          },
        ];

        setSuppliers(mockData);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement des fournisseurs");
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  // Filtrer les fournisseurs selon la recherche
  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gestion des changements de formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentSupplier((prev) => ({
      ...(prev || ({} as Supplier)),
      [name]: value,
    }));
  };

  // Ouvrir le formulaire d'ajout
  const handleAddSupplier = () => {
    setCurrentSupplier({
      id: "",
      name: "",
      contact: "",
      phone: "",
      email: "",
      address: "",
      type: "medicament",
      status: "active",
      products: [],
    });
    setIsDialogOpen(true);
  };

  // Ouvrir le formulaire de modification
  const handleEditSupplier = (supplier: Supplier) => {
    setCurrentSupplier(supplier);
    setIsDialogOpen(true);
  };

  // Confirmer la suppression
  const confirmDeleteSupplier = (id: string) => {
    setSupplierToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Soumettre le formulaire
  const handleSubmit = () => {
    try {
      if (!currentSupplier) return;

      // Validation simple
      if (!currentSupplier.name || !currentSupplier.contact) {
        setError("Le nom et le contact sont obligatoires");
        return;
      }

      if (currentSupplier.id) {
        // Modification
        setSuppliers((prev) =>
          prev.map((s) => (s.id === currentSupplier.id ? currentSupplier : s))
        );
        setSuccess("Fournisseur mis à jour avec succès");
      } else {
        // Ajout
        const newSupplier = {
          ...currentSupplier,
          id: `sup-${Math.random().toString(36).substr(2, 9)}`,
        };
        setSuppliers((prev) => [...prev, newSupplier]);
        setSuccess("Fournisseur ajouté avec succès");
      }

      setIsDialogOpen(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Erreur lors de la sauvegarde");
    }
  };

  // Supprimer un fournisseur
  const handleDelete = () => {
    if (!supplierToDelete) return;

    setSuppliers((prev) => prev.filter((s) => s.id !== supplierToDelete));
    setSuccess("Fournisseur supprimé avec succès");
    setIsDeleteDialogOpen(false);
    setSupplierToDelete(null);
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestion des Fournisseurs
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Liste et gestion des fournisseurs de médicaments et matériel médical
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Input
            placeholder="Rechercher un fournisseur..."
            className="w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={handleAddSupplier} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Ajouter un Fournisseur
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6">
          <AlertTitle>Succès</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : suppliers.length === 0 ? (
        <Alert variant="info" className="mb-6">
          <AlertTitle>Aucun fournisseur enregistré</AlertTitle>
          <AlertDescription>
            Commencez par ajouter un fournisseur en cliquant sur le bouton
            "Ajouter un Fournisseur".
          </AlertDescription>
        </Alert>
      ) : (
        <Card className="border rounded-lg shadow-sm">
          <CardHeader className="border-b px-6 py-4">
            <CardTitle className="text-lg font-semibold">
              Liste des Fournisseurs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-800">
                <TableRow>
                  <TableHead className="w-[200px]">Nom</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-gray-500"
                    >
                      Aucun fournisseur trouvé pour votre recherche
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSuppliers.map((supplier) => (
                    <TableRow
                      key={supplier.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {supplier.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{supplier.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {supplier.address}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{supplier.contact}</TableCell>
                      <TableCell>{supplier.phone}</TableCell>
                      <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                        {supplier.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            supplier.type === "medicament"
                              ? "default"
                              : supplier.type === "materiel"
                                ? "secondary"
                                : "outline"
                          }
                          className="whitespace-nowrap"
                        >
                          {supplier.type === "medicament" && "Médicaments"}
                          {supplier.type === "materiel" && "Matériel"}
                          {supplier.type === "both" && "Médicaments & Matériel"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            supplier.status === "active"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {supplier.status === "active" ? "Actif" : "Inactif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditSupplier(supplier)}
                            title="Modifier"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => confirmDeleteSupplier(supplier.id)}
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Dialogue d'édition/ajout */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {currentSupplier?.id
                ? "Modifier le fournisseur"
                : "Nouveau fournisseur"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={currentSupplier?.name || ""}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Nom du fournisseur"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact" className="text-right">
                Responsable <span className="text-destructive">*</span>
              </Label>
              <Input
                id="contact"
                name="contact"
                value={currentSupplier?.contact || ""}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Nom du responsable"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Téléphone
              </Label>
              <Input
                id="phone"
                name="phone"
                value={currentSupplier?.phone || ""}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Numéro de téléphone"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={currentSupplier?.email || ""}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Email de contact"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Adresse
              </Label>
              <Input
                id="address"
                name="address"
                value={currentSupplier?.address || ""}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Adresse complète"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={currentSupplier?.type || "medicament"}
                onValueChange={(value: "medicament" | "materiel" | "both") =>
                  setCurrentSupplier((prev) => ({
                    ...(prev || ({} as Supplier)),
                    type: value,
                  }))
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medicament">Médicaments</SelectItem>
                  <SelectItem value="materiel">Matériel médical</SelectItem>
                  <SelectItem value="both">Les deux</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Statut
              </Label>
              <Select
                value={currentSupplier?.status || "active"}
                onValueChange={(value: "active" | "inactive") =>
                  setCurrentSupplier((prev) => ({
                    ...(prev || ({} as Supplier)),
                    status: value,
                  }))
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              {currentSupplier?.id ? "Enregistrer" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogue de confirmation de suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">
              Confirmer la suppression
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 dark:text-gray-300">
              Êtes-vous sûr de vouloir supprimer ce fournisseur ? Cette action
              est irréversible et supprimera toutes les données associées.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Confirmer la suppression
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
