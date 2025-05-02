import { createFileRoute } from '@tanstack/react-router'
import { PlusCircle, Search, Edit, Trash2, Package, Pill } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Article {
  id: string
  nom: string
  type: 'médicament' | 'matériel'
  categorie: string
  fournisseur: string
  dateEntree: string
  datePeremption: string
  quantite: number
  stockMinimum: number
  unite: string
  statut: 'actif' | 'inactif'
}

export const Route = createFileRoute('/_medical-stock/article')({
  component: RouteComponent,
})

function RouteComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null)
  const [notification, setNotification] = useState<{show: boolean, message: string, type: 'success' | 'error'} | null>(null)
  const [articles, setArticles] = useState<Article[]>([
    {
      id: 'MED-001',
      nom: 'Paracétamol 500mg',
      type: 'médicament',
      categorie: 'Antalgique',
      fournisseur: 'PharmaCI',
      dateEntree: '2024-01-15',
      datePeremption: '2025-06-30',
      quantite: 120,
      stockMinimum: 50,
      unite: 'boîte',
      statut: 'actif'
    },
    {
      id: 'MED-002',
      nom: 'Amoxicilline 1g',
      type: 'médicament',
      categorie: 'Antibiotique',
      fournisseur: 'Sanofi',
      dateEntree: '2024-02-10',
      datePeremption: '2025-01-31',
      quantite: 80,
      stockMinimum: 30,
      unite: 'flacon',
      statut: 'actif'
    },
    {
      id: 'MAT-001',
      nom: 'Gants stériles',
      type: 'matériel',
      categorie: 'Protection',
      fournisseur: 'MediSupply',
      dateEntree: '2023-12-05',
      datePeremption: '2025-12-31',
      quantite: 500,
      stockMinimum: 200,
      unite: 'paire',
      statut: 'actif'
    }
  ])

  // Afficher une notification
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ show: true, message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  // Filtrer les articles
  const filteredArticles = articles.filter(article =>
    article.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.categorie.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Gérer l'état du stock
  const getStockStatus = (quantite: number, stockMinimum: number) => {
    if (quantite <= 0) return 'rupture'
    if (quantite <= stockMinimum) return 'alerte'
    return 'normal'
  }

  // Formater la date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy', { locale: fr })
  }

  // Ajouter un nouvel article
  const handleAddArticle = (newArticle: Article) => {
    setArticles([...articles, newArticle])
    showNotification('Article ajouté avec succès')
    setIsAddDialogOpen(false)
  }

  // Modifier un article existant
  const handleUpdateArticle = (updatedArticle: Article) => {
    setArticles(articles.map(article => 
      article.id === updatedArticle.id ? updatedArticle : article
    ))
    showNotification('Article modifié avec succès')
    setIsDialogOpen(false)
  }

  // Supprimer un article
  const handleDeleteArticle = (id: string) => {
    setArticles(articles.filter(article => article.id !== id))
    showNotification('Article supprimé avec succès')
    setIsDeleteDialogOpen(false)
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Notification */}
      {notification?.show && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* En-tête */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold  text-[#018a8cff]">
          Gestion des Articles Médicaux
        </h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#018a8cff]">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nouvel Article
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Ajouter un nouvel article</DialogTitle>
            </DialogHeader>
            <ArticleForm
              onSubmit={handleAddArticle}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, ID ou catégorie..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtrer :</span>
          <Select>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Tous types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous types</SelectItem>
              <SelectItem value="medicament">Médicaments</SelectItem>
              <SelectItem value="materiel">Matériels</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tableau des articles */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Article</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Fournisseur</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Péremption</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">{article.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {article.type === "médicament" ? (
                        <Pill className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Package className="h-4 w-4 text-green-500" />
                      )}
                      {article.nom}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {article.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{article.categorie}</TableCell>
                  <TableCell>{article.fournisseur}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>
                        {article.quantite} {article.unite}
                      </span>
                      {getStockStatus(
                        article.quantite,
                        article.stockMinimum
                      ) === "alerte" && (
                        <Badge
                          variant="destructive"
                          className="px-1 py-0 text-xs"
                        >
                          Stock faible
                        </Badge>
                      )}
                      {getStockStatus(
                        article.quantite,
                        article.stockMinimum
                      ) === "rupture" && (
                        <Badge
                          variant="destructive"
                          className="px-1 py-0 text-xs"
                        >
                          Rupture
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDate(article.datePeremption)}
                    {new Date(article.datePeremption) < new Date() && (
                      <Badge
                        variant="destructive"
                        className="ml-2 px-1 py-0 text-xs"
                      >
                        Périmé
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        article.statut === "actif" ? "default" : "secondary"
                      }
                    >
                      {article.statut === "actif" ? "Actif" : "Inactif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedArticle(article)}
                        >
                          <Edit className="h-4 w-4 text-[#018a8cff]" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Modifier l'article</DialogTitle>
                        </DialogHeader>
                        {selectedArticle && (
                          <ArticleForm
                            article={selectedArticle}
                            onSubmit={handleUpdateArticle}
                            onCancel={() => setIsDialogOpen(false)}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setArticleToDelete(article.id);
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
                <TableCell colSpan={9} className="h-24 text-center">
                  Aucun article trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Confirmation de suppression */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Êtes-vous sûr de vouloir supprimer
              cet article ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (articleToDelete) {
                  handleDeleteArticle(articleToDelete);
                }
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ArticleForm({ 
  article, 
  onSubmit,
  onCancel
}: { 
  article?: Article, 
  onSubmit: (article: Article) => void,
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    id: article?.id || `ART-${Math.floor(1000 + Math.random() * 9000)}`,
    nom: article?.nom || '',
    type: article?.type || 'médicament',
    categorie: article?.categorie || '',
    fournisseur: article?.fournisseur || '',
    dateEntree: article?.dateEntree || format(new Date(), 'yyyy-MM-dd'),
    datePeremption: article?.datePeremption || '',
    quantite: article?.quantite || 0,
    stockMinimum: article?.stockMinimum || 10,
    unite: article?.unite || 'boîte',
    statut: article?.statut || 'actif'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="nom" className="block text-sm font-medium">
            Nom de l'article*
          </label>
          <Input
            id="nom"
            value={formData.nom}
            onChange={(e) => setFormData({...formData, nom: e.target.value})}
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="type" className="block text-sm font-medium">
            Type*
          </label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({...formData, type: value as 'médicament' | 'matériel'})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="médicament">Médicament</SelectItem>
              <SelectItem value="matériel">Matériel</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="categorie" className="block text-sm font-medium">
            Catégorie*
          </label>
          <Input
            id="categorie"
            value={formData.categorie}
            onChange={(e) => setFormData({...formData, categorie: e.target.value})}
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="fournisseur" className="block text-sm font-medium">
            Fournisseur*
          </label>
          <Input
            id="fournisseur"
            value={formData.fournisseur}
            onChange={(e) => setFormData({...formData, fournisseur: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="quantite" className="block text-sm font-medium">
            Quantité en stock*
          </label>
          <Input
            id="quantite"
            type="number"
            min="0"
            value={formData.quantite}
            onChange={(e) => setFormData({...formData, quantite: Number(e.target.value)})}
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="stockMinimum" className="block text-sm font-medium">
            Stock minimum*
          </label>
          <Input
            id="stockMinimum"
            type="number"
            min="0"
            value={formData.stockMinimum}
            onChange={(e) => setFormData({...formData, stockMinimum: Number(e.target.value)})}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="unite" className="block text-sm font-medium">
            Unité de mesure*
          </label>
          <Select
            value={formData.unite}
            onValueChange={(value) => setFormData({...formData, unite: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une unité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="boîte">Boîte</SelectItem>
              <SelectItem value="flacon">Flacon</SelectItem>
              <SelectItem value="paire">Paire</SelectItem>
              <SelectItem value="unité">Unité</SelectItem>
              <SelectItem value="kg">Kilogramme</SelectItem>
              <SelectItem value="L">Litre</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label htmlFor="statut" className="block text-sm font-medium">
            Statut*
          </label>
          <Select
            value={formData.statut}
            onValueChange={(value) => setFormData({...formData, statut: value as 'actif' | 'inactif'})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="actif">Actif</SelectItem>
              <SelectItem value="inactif">Inactif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="dateEntree" className="block text-sm font-medium">
            Date d'entrée*
          </label>
          <Input
            id="dateEntree"
            type="date"
            value={formData.dateEntree}
            onChange={(e) => setFormData({...formData, dateEntree: e.target.value})}
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="datePeremption" className="block text-sm font-medium">
            Date de péremption*
          </label>
          <Input
            id="datePeremption"
            type="date"
            value={formData.datePeremption}
            onChange={(e) => setFormData({...formData, datePeremption: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          {article ? 'Enregistrer les modifications' : 'Ajouter l\'article'}
        </Button>
      </div>
    </form>
  )
}