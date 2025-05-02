import { createFileRoute } from "@tanstack/react-router";
import {
  PlusCircle,
  Search,
  FileText,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Printer,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Commande {
  id: string;
  fournisseur: string;
  dateCommande: string;
  dateLivraisonPrevue: string;
  statut: "en_attente" | "validee" | "livree" | "annulee";
  montant: number;
  articles: {
    id: string;
    nom: string;
    quantite: number;
    prixUnitaire: number;
  }[];
  documents?: string[];
}

export const Route = createFileRoute("/_medical-stock/commande")({
  component: RouteComponent,
});

function RouteComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCommande, setSelectedCommande] = useState<Commande | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [commandeToDelete, setCommandeToDelete] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const [commandes, setCommandes] = useState<Commande[]>([
    {
      id: "CMD-2023-001",
      fournisseur: "PharmaCI",
      dateCommande: "2023-10-15",
      dateLivraisonPrevue: "2023-11-05",
      statut: "livree",
      montant: 1250.5,
      articles: [
        {
          id: "MED-001",
          nom: "Paracétamol 500mg",
          quantite: 50,
          prixUnitaire: 5.5,
        },
        {
          id: "MED-002",
          nom: "Amoxicilline 1g",
          quantite: 30,
          prixUnitaire: 8.75,
        },
      ],
      documents: ["bon_commande_001.pdf", "facture_001.pdf"],
    },
  ]);

  // Convertir en FCFA (1€ = 655.957 FCFA)
  const convertToFCFA = (montantEUR: number) => {
    return (montantEUR * 655.957).toFixed(2);
  };

  const filteredCommandes = commandes.filter(
    (commande) =>
      commande.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commande.fournisseur.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (statut: Commande["statut"]) => {
    switch (statut) {
      case "en_attente":
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" /> En attente
          </Badge>
        );
      case "validee":
        return (
          <Badge className="bg-blue-500">
            <CheckCircle className="h-3 w-3 mr-1" /> Validée
          </Badge>
        );
      case "livree":
        return (
          <Badge className="bg-green-500">
            <Truck className="h-3 w-3 mr-1" /> Livrée
          </Badge>
        );
      case "annulee":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" /> Annulée
          </Badge>
        );
    }
  };

  const handleCreateCommande = (newCommande: Commande) => {
    setCommandes([...commandes, newCommande]);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateStatut = (id: string, newStatut: Commande["statut"]) => {
    setCommandes(
      commandes.map((commande) =>
        commande.id === id ? { ...commande, statut: newStatut } : commande
      )
    );
  };

  const handleDeleteCommande = (id: string) => {
    setCommandes(commandes.filter((commande) => commande.id !== id));
    setIsDeleteDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy", { locale: fr });
  };

  const handlePrint = (commande: Commande, type: "bon" | "facture") => {
    setSelectedCommande(commande);
    setTimeout(() => {
      if (printRef.current) {
        const printWindow = window.open("", "", "width=800,height=600");
        const title =
          type === "bon"
            ? `Bon de Commande ${commande.id}`
            : `Facture ${commande.id}`;

        printWindow?.document.write(`
          <html>
            <head>
              <title>${title}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
                .title { font-size: 24px; font-weight: bold; margin-bottom: 20px; }
                .info-section { margin-bottom: 20px; }
                .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .signature { margin-top: 50px; display: flex; justify-content: space-between; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .footer { margin-top: 30px; font-size: 12px; text-align: center; }
                .montant-fcfa { color: #d35400; font-weight: bold; }
                @media print {
                  .no-print { display: none !important; }
                  body { margin: 0; padding: 10px; }
                }
              </style>
            </head>
            <body>
              ${printRef.current.innerHTML}
            </body>
          </html>
        `);
        printWindow?.document.close();
        printWindow?.focus();
        printWindow?.print();
      }
    }, 100);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Commandes d'Achat</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nouvelle Commande
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle commande</DialogTitle>
            </DialogHeader>
            <CommandeForm
              fournisseurs={["PharmaCI", "MediSupply", "Sanofi", "BD Medical"]}
              articlesDisponibles={[
                { id: "MED-001", nom: "Paracétamol 500mg", prix: 5.5 },
                { id: "MED-002", nom: "Amoxicilline 1g", prix: 8.75 },
                { id: "MAT-001", nom: "Gants stériles", prix: 0.75 },
                { id: "MAT-002", nom: "Seringues 10ml", prix: 1.4 },
              ]}
              onSubmit={handleCreateCommande}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par n° de commande ou fournisseur..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="en_attente">En attente</SelectItem>
            <SelectItem value="validee">Validée</SelectItem>
            <SelectItem value="livree">Livrée</SelectItem>
            <SelectItem value="annulee">Annulée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Commande</TableHead>
              <TableHead>Fournisseur</TableHead>
              <TableHead>Date Commande</TableHead>
              <TableHead>Livraison Prévue</TableHead>
              <TableHead>Montant (FCFA)</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCommandes.length > 0 ? (
              filteredCommandes.map((commande) => (
                <TableRow key={commande.id}>
                  <TableCell className="font-medium">{commande.id}</TableCell>
                  <TableCell>{commande.fournisseur}</TableCell>
                  <TableCell>{formatDate(commande.dateCommande)}</TableCell>
                  <TableCell>
                    {formatDate(commande.dateLivraisonPrevue)}
                  </TableCell>
                  <TableCell>{convertToFCFA(commande.montant)} FCFA</TableCell>
                  <TableCell>
                    <Select
                      value={commande.statut}
                      onValueChange={(value) =>
                        handleUpdateStatut(
                          commande.id,
                          value as Commande["statut"]
                        )
                      }
                    >
                      <SelectTrigger className="w-[150px]">
                        {getStatusBadge(commande.statut)}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en_attente">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-2" /> En attente
                          </div>
                        </SelectItem>
                        <SelectItem value="validee">
                          <div className="flex items-center">
                            <CheckCircle className="h-3 w-3 mr-2" /> Validée
                          </div>
                        </SelectItem>
                        <SelectItem value="livree">
                          <div className="flex items-center">
                            <Truck className="h-3 w-3 mr-2" /> Livrée
                          </div>
                        </SelectItem>
                        <SelectItem value="annulee">
                          <div className="flex items-center">
                            <XCircle className="h-3 w-3 mr-2" /> Annulée
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePrint(commande, "bon")}
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedCommande(commande);
                        setIsDialogOpen(true);
                      }}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setCommandeToDelete(commande.id);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Aucune commande trouvée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera définitivement la commande{" "}
              {commandeToDelete} et ne peut être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (commandeToDelete) {
                  handleDeleteCommande(commandeToDelete);
                }
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="hidden">
        <div ref={printRef}>
          {selectedCommande && (
            <div className="p-6">
              <div className="header">
                <div>
                  <h1 className="title">Clinique Médicale ENIAZOU</h1>
                  <p>Abidjan, Yopougon Selmer</p>
                  <p>Côte d'Ivoire</p>
                  <p>Tél: +225 07 08 39 77 87</p>
                </div>
                <div className="text-right">
                  <h2 className="title">BON DE COMMANDE</h2>
                  <p>
                    N°: <strong>{selectedCommande.id}</strong>
                  </p>
                  <p>
                    Date:{" "}
                    {format(
                      new Date(selectedCommande.dateCommande),
                      "dd/MM/yyyy"
                    )}
                  </p>
                </div>
              </div>

              <div className="info-section">
                <div className="info-grid">
                  <div>
                    <h2 className="font-bold mb-2">Fournisseur:</h2>
                    <p>{selectedCommande.fournisseur}</p>
                  </div>
                  <div>
                    <h2 className="font-bold mb-2">Livraison prévue:</h2>
                    <p>
                      {format(
                        new Date(selectedCommande.dateLivraisonPrevue),
                        "dd/MM/yyyy"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Désignation</th>
                    <th>Prix unitaire (FCFA)</th>
                    <th>Quantité</th>
                    <th>Total (FCFA)</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCommande.articles.map((article) => (
                    <tr key={article.id}>
                      <td>{article.nom}</td>
                      <td>{convertToFCFA(article.prixUnitaire)}</td>
                      <td>{article.quantite}</td>
                      <td>
                        {convertToFCFA(article.quantite * article.prixUnitaire)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="text-right mt-4">
                <p className="font-bold">
                  Total: {convertToFCFA(selectedCommande.montant)} FCFA
                </p>
              </div>

              <div className="signature">
                <div>
                  <p>Le Responsable des Achats</p>
                  <div className="mt-12 border-t w-48"></div>
                </div>
                <div>
                  <p>Le Fournisseur</p>
                  <div className="mt-12 border-t w-48"></div>
                </div>
              </div>

              <div className="footer">
                <p>
                  Merci pour votre confiance - Document généré automatiquement
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Détails de la commande {selectedCommande?.id}
            </DialogTitle>
          </DialogHeader>
          {selectedCommande && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Fournisseur</h3>
                  <p>{selectedCommande.fournisseur}</p>
                </div>
                <div>
                  <h3 className="font-medium">Statut</h3>
                  {getStatusBadge(selectedCommande.statut)}
                </div>
                <div>
                  <h3 className="font-medium">Date de commande</h3>
                  <p>{formatDate(selectedCommande.dateCommande)}</p>
                </div>
                <div>
                  <h3 className="font-medium">Livraison prévue</h3>
                  <p>{formatDate(selectedCommande.dateLivraisonPrevue)}</p>
                </div>
                <div>
                  <h3 className="font-medium">Montant total</h3>
                  <p className="font-bold">
                    {convertToFCFA(selectedCommande.montant)} FCFA
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Articles commandés</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Article</TableHead>
                      <TableHead>Prix unitaire (FCFA)</TableHead>
                      <TableHead>Quantité</TableHead>
                      <TableHead>Total (FCFA)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedCommande.articles.map((article) => (
                      <TableRow key={article.id}>
                        <TableCell>{article.nom}</TableCell>
                        <TableCell>
                          {convertToFCFA(article.prixUnitaire)}
                        </TableCell>
                        <TableCell>{article.quantite}</TableCell>
                        <TableCell>
                          {convertToFCFA(
                            article.quantite * article.prixUnitaire
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end gap-2">
                <Button onClick={() => handlePrint(selectedCommande, "bon")}>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimer le bon
                </Button>
                <Button
                  onClick={() => handlePrint(selectedCommande, "facture")}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimer la facture
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CommandeForm({
  fournisseurs,
  articlesDisponibles,
  onSubmit,
  onCancel,
}: {
  fournisseurs: string[];
  articlesDisponibles: { id: string; nom: string; prix: number }[];
  onSubmit: (commande: Commande) => void;
  onCancel: () => void;
}) {
  const [selectedArticles, setSelectedArticles] = useState<
    {
      id: string;
      nom: string;
      quantite: number;
      prixUnitaire: number;
    }[]
  >([]);
  const [customArticle, setCustomArticle] = useState({
    nom: "",
    prix: "",
  });
  const [showCustomArticleForm, setShowCustomArticleForm] = useState(false);

  const [formData, setFormData] = useState({
    fournisseur: "",
    dateLivraisonPrevue: format(
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      "yyyy-MM-dd"
    ),
  });

  const handleAddArticle = (article: {
    id: string;
    nom: string;
    prix: number;
  }) => {
    setSelectedArticles([
      ...selectedArticles,
      {
        id: article.id,
        nom: article.nom,
        quantite: 1,
        prixUnitaire: article.prix,
      },
    ]);
  };

  const handleAddCustomArticle = () => {
    if (customArticle.nom && customArticle.prix) {
      setSelectedArticles([
        ...selectedArticles,
        {
          id: `CUSTOM-${Date.now()}`,
          nom: customArticle.nom,
          quantite: 1,
          prixUnitaire: parseFloat(customArticle.prix),
        },
      ]);
      setCustomArticle({ nom: "", prix: "" });
      setShowCustomArticleForm(false);
    }
  };

  const handleRemoveArticle = (id: string) => {
    setSelectedArticles(
      selectedArticles.filter((article) => article.id !== id)
    );
  };

  const handleQuantityChange = (id: string, quantite: number) => {
    setSelectedArticles(
      selectedArticles.map((article) =>
        article.id === id ? { ...article, quantite } : article
      )
    );
  };

  const calculateTotal = () => {
    return selectedArticles.reduce(
      (total, article) => total + article.quantite * article.prixUnitaire,
      0
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fournisseur || selectedArticles.length === 0) return;

    const newCommande: Commande = {
      id: `CMD-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      fournisseur: formData.fournisseur,
      dateCommande: format(new Date(), "yyyy-MM-dd"),
      dateLivraisonPrevue: formData.dateLivraisonPrevue,
      statut: "en_attente",
      montant: calculateTotal(),
      articles: selectedArticles,
    };

    onSubmit(newCommande);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="fournisseur" className="block text-sm font-medium">
            Fournisseur*
          </label>
          <Select
            value={formData.fournisseur}
            onValueChange={(value) =>
              setFormData({ ...formData, fournisseur: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un fournisseur" />
            </SelectTrigger>
            <SelectContent>
              {fournisseurs.map((fournisseur) => (
                <SelectItem key={fournisseur} value={fournisseur}>
                  {fournisseur}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="dateLivraisonPrevue"
            className="block text-sm font-medium"
          >
            Date de livraison prévue*
          </label>
          <Input
            id="dateLivraisonPrevue"
            type="date"
            value={formData.dateLivraisonPrevue}
            onChange={(e) =>
              setFormData({ ...formData, dateLivraisonPrevue: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Articles à commander</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="article" className="block text-sm font-medium">
              Ajouter un article
            </label>
            <Select
              onValueChange={(value) => {
                if (value === "custom") {
                  setShowCustomArticleForm(true);
                } else {
                  const article = articlesDisponibles.find(
                    (a) => a.id === value
                  );
                  if (article) handleAddArticle(article);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un article" />
              </SelectTrigger>
              <SelectContent>
                {articlesDisponibles.map((article) => (
                  <SelectItem key={article.id} value={article.id}>
                    {article.nom} - {article.prix.toFixed(2)} €
                  </SelectItem>
                ))}
                <SelectItem value="custom">
                  + Ajouter un article personnalisé
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {showCustomArticleForm && (
          <div className="border p-4 rounded-md">
            <h4 className="font-medium mb-2">Nouvel article</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="customNom"
                  className="block text-sm font-medium"
                >
                  Nom de l'article*
                </label>
                <Input
                  id="customNom"
                  value={customArticle.nom}
                  onChange={(e) =>
                    setCustomArticle({ ...customArticle, nom: e.target.value })
                  }
                  placeholder="Nom de l'article"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="customPrix"
                  className="block text-sm font-medium"
                >
                  Prix unitaire (CFA)*
                </label>
                <Input
                  id="customPrix"
                  type="number"
                  min="0"
                  step="0.01"
                  value={customArticle.prix}
                  onChange={(e) =>
                    setCustomArticle({ ...customArticle, prix: e.target.value })
                  }
                  placeholder="Prix en €"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCustomArticleForm(false)}
              >
                Annuler
              </Button>
              <Button
                type="button"
                onClick={handleAddCustomArticle}
                disabled={!customArticle.nom || !customArticle.prix}
              >
                Ajouter l'article
              </Button>
            </div>
          </div>
        )}

        {selectedArticles.length > 0 ? (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Article</TableHead>
                  <TableHead>Prix unitaire (FCFA)</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Total (FCFA)</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedArticles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>{article.nom}</TableCell>
                    <TableCell>
                      {(article.prixUnitaire * 655.957).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={article.quantite}
                        onChange={(e) =>
                          handleQuantityChange(
                            article.id,
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      {(
                        article.quantite *
                        article.prixUnitaire *
                        655.957
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveArticle(article.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total:</span>
                <span className="font-bold">
                  {(calculateTotal() * 655.957).toFixed(2)} FCFA
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 border rounded-md text-center text-muted-foreground">
            Aucun article sélectionné
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={!formData.fournisseur || selectedArticles.length === 0}
        >
          Créer la commande
        </Button>
      </div>
    </form>
  );
}
