import { createFileRoute } from "@tanstack/react-router";
import { useState, } from "react";
import {
  Calendar,
  Clock,
  User,
  Droplet,
  Phone,
  MapPin,
  Search,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_opd/vaccin")({
  component: VaccinationPage,
});

type Vaccine = {
  id: string;
  code: string;
  name: string;
  price: number;
  selected: boolean;
  quantity: number;
};

type Patient = {
  title: string;
  fullName: string;
  age: {
    years: number;
    months: number;
    days: number;
  };
  bloodGroup: string;
  gender: string;
  address: string;
  phone: string;
  dob: string;
  guardian: string;
  height: number;
  weight: number;
  headCircumference: number;
};

const availableVaccines: Vaccine[] = [
  {
    id: "1",
    code: "VAC01",
    name: "BCG",
    price: 58,
    selected: false,
    quantity: 1,
  },
  {
    id: "2",
    code: "VAC02",
    name: "DTP",
    price: 37,
    selected: false,
    quantity: 1,
  },
  {
    id: "3",
    code: "VAC03",
    name: "Polio",
    price: 42,
    selected: false,
    quantity: 1,
  },
  {
    id: "4",
    code: "VAC04",
    name: "Rougeole",
    price: 65,
    selected: false,
    quantity: 1,
  },
  {
    id: "5",
    code: "VAC05",
    name: "Hépatite B",
    price: 75,
    selected: false,
    quantity: 1,
  },
];

function VaccinationPage() {
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [time, setTime] = useState<string>(
    new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
  const [selectedVaccine, setSelectedVaccine] = useState<string>("");
  const [lotNumber, setLotNumber] = useState<string>("");
  const [referredBy, setReferredBy] = useState<string>("self");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);

  const [patient, setPatient] = useState<Patient>({
    title: "M.",
    fullName: "Jean Dupont",
    age: { years: 5, months: 3, days: 15 },
    bloodGroup: "A+",
    gender: "Masculin",
    address: "12 Rue de la Paix, Abidjan",
    phone: "07 12 34 56 78",
    dob: "2018-04-15",
    guardian: "Marie Dupont",
    height: 110,
    weight: 18.5,
    headCircumference: 50,
  });

  const [vaccines, setVaccines] = useState<Vaccine[]>(availableVaccines);
  const [selectedVaccines, setSelectedVaccines] = useState<Vaccine[]>([]);

  // Filtrer les vaccins
  const filteredVaccines = vaccines.filter(
    (vaccine) =>
      vaccine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vaccine.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ajouter/supprimer un vaccin de la sélection
  const toggleVaccineSelection = (id: string) => {
    const updatedVaccines = vaccines.map((vaccine) => {
      if (vaccine.id === id) {
        const selected = !vaccine.selected;
        return { ...vaccine, selected, quantity: selected ? 1 : 0 };
      }
      return vaccine;
    });

    setVaccines(updatedVaccines);
    setSelectedVaccines(updatedVaccines.filter((v) => v.selected));
  };

  // Modifier la quantité d'un vaccin
  const updateQuantity = (id: string, action: "increase" | "decrease") => {
    const updatedVaccines = vaccines.map((vaccine) => {
      if (vaccine.id === id) {
        const newQuantity =
          action === "increase"
            ? vaccine.quantity + 1
            : Math.max(1, vaccine.quantity - 1);
        return { ...vaccine, quantity: newQuantity };
      }
      return vaccine;
    });

    setVaccines(updatedVaccines);
    setSelectedVaccines(updatedVaccines.filter((v) => v.selected));
  };

  // Supprimer un vaccin de la sélection
  const removeVaccine = (id: string) => {
    const updatedVaccines = vaccines.map((vaccine) => {
      if (vaccine.id === id) {
        return { ...vaccine, selected: false, quantity: 1 };
      }
      return vaccine;
    });

    setVaccines(updatedVaccines);
    setSelectedVaccines(updatedVaccines.filter((v) => v.selected));
  };

  // Calculer le total
  const subtotal = selectedVaccines.reduce(
    (sum, vaccine) => sum + vaccine.price * vaccine.quantity,
    0
  );
  const total = subtotal - discount;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#018a8c]">Vaccination</h1>
          <p className="text-muted-foreground">
            Enregistrement d'une vaccination
          </p>
        </div>
        <div className="bg-[#018a8c] text-white p-3 rounded-lg shadow">
          <Calendar className="h-6 w-6" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne de gauche - Informations patient et vaccin */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations sur le vaccin */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-[#018a8c] mb-4">
              Informations sur le vaccin
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Date de vaccination</Label>
                <div className="relative">
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div>
                <Label>Heure</Label>
                <div className="relative">
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                  <Clock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div>
                <Label>Vaccin</Label>
                <Select
                  value={selectedVaccine}
                  onValueChange={setSelectedVaccine}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un vaccin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bcg">BCG</SelectItem>
                    <SelectItem value="dtp">DTP</SelectItem>
                    <SelectItem value="polio">Polio</SelectItem>
                    <SelectItem value="rougeole">Rougeole</SelectItem>
                    <SelectItem value="hepatite-b">Hépatite B</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Numéro de lot (optionnel)</Label>
                <Input
                  value={lotNumber}
                  onChange={(e) => setLotNumber(e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <Label>Consultant / Référé par</Label>
                <Select value={referredBy} onValueChange={setReferredBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="self">Self</SelectItem>
                    <SelectItem value="dr-konan">Dr. Konan Kouakou</SelectItem>
                    <SelectItem value="dr-ahmed">Dr. Ahmed Diallo</SelectItem>
                    <SelectItem value="dr-marie">
                      Dr. Marie N'Guessan
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Informations sur le patient */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-[#018a8c] mb-4">
              Informations sur le patient
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Civilité</Label>
                <Select
                  value={patient.title}
                  onValueChange={(value) =>
                    setPatient({ ...patient, title: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M.">M.</SelectItem>
                    <SelectItem value="Mme">Mme</SelectItem>
                    <SelectItem value="Mlle">Mlle</SelectItem>
                    <SelectItem value="Dr">Dr</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Nom complet</Label>
                <Input
                  value={patient.fullName}
                  onChange={(e) =>
                    setPatient({ ...patient, fullName: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label>Âge (ans)</Label>
                  <Input
                    type="number"
                    value={patient.age.years}
                    onChange={(e) =>
                      setPatient({
                        ...patient,
                        age: {
                          ...patient.age,
                          years: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Mois</Label>
                  <Input
                    type="number"
                    value={patient.age.months}
                    onChange={(e) =>
                      setPatient({
                        ...patient,
                        age: {
                          ...patient.age,
                          months: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Jours</Label>
                  <Input
                    type="number"
                    value={patient.age.days}
                    onChange={(e) =>
                      setPatient({
                        ...patient,
                        age: {
                          ...patient.age,
                          days: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Groupe sanguin</Label>
                <Select
                  value={patient.bloodGroup}
                  onValueChange={(value) =>
                    setPatient({ ...patient, bloodGroup: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Sexe</Label>
                <Select
                  value={patient.gender}
                  onValueChange={(value) =>
                    setPatient({ ...patient, gender: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculin">Masculin</SelectItem>
                    <SelectItem value="Féminin">Féminin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Date de naissance</Label>
                <Input
                  type="date"
                  value={patient.dob}
                  onChange={(e) =>
                    setPatient({ ...patient, dob: e.target.value })
                  }
                />
              </div>

              <div className="md:col-span-2">
                <Label>Adresse</Label>
                <Input
                  value={patient.address}
                  onChange={(e) =>
                    setPatient({ ...patient, address: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Téléphone</Label>
                <Input
                  value={patient.phone}
                  onChange={(e) =>
                    setPatient({ ...patient, phone: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Tuteur</Label>
                <Input
                  value={patient.guardian}
                  onChange={(e) =>
                    setPatient({ ...patient, guardian: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Taille (cm)</Label>
                <Input
                  type="number"
                  value={patient.height}
                  onChange={(e) =>
                    setPatient({
                      ...patient,
                      height: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div>
                <Label>Poids (kg)</Label>
                <Input
                  type="number"
                  value={patient.weight}
                  onChange={(e) =>
                    setPatient({
                      ...patient,
                      weight: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div>
                <Label>Périmètre crânien (cm)</Label>
                <Input
                  type="number"
                  value={patient.headCircumference}
                  onChange={(e) =>
                    setPatient({
                      ...patient,
                      headCircumference: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Liste des vaccins disponibles */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-[#018a8c] mb-4">
              Vaccins disponibles
            </h2>

            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[#018a8c]" />
              </div>
              <Input
                placeholder="Rechercher un vaccin..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              {filteredVaccines.map((vaccine) => (
                <div
                  key={vaccine.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      checked={vaccine.selected}
                      onCheckedChange={() => toggleVaccineSelection(vaccine.id)}
                    />
                    <div>
                      <p className="font-medium">{vaccine.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {vaccine.code} - {vaccine.price} FCFA
                      </p>
                    </div>
                  </div>

                  {vaccine.selected && (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(vaccine.id, "decrease")}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">
                        {vaccine.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(vaccine.id, "increase")}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Colonne de droite - Récapitulatif */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-[#018a8c] mb-4">
              Récapitulatif
            </h2>

            {selectedVaccines.length > 0 ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vaccin</TableHead>
                      <TableHead className="text-right">
                        Prix unitaire
                      </TableHead>
                      <TableHead className="text-right">Quantité</TableHead>
                      <TableHead className="text-right">Montant</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedVaccines.map((vaccine) => (
                      <TableRow key={vaccine.id}>
                        <TableCell>{vaccine.name}</TableCell>
                        <TableCell className="text-right">
                          {vaccine.price} FCFA
                        </TableCell>
                        <TableCell className="text-right">
                          {vaccine.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          {vaccine.price * vaccine.quantity} FCFA
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeVaccine(vaccine.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-6 space-y-3">
                  <div className="flex justify-between">
                    <span>Sous-total:</span>
                    <span className="font-medium">{subtotal} FCFA</span>
                  </div>

                  <div className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <span>Remise:</span>
                      <Input
                        type="number"
                        className="w-20 h-8"
                        value={discount}
                        onChange={(e) =>
                          setDiscount(parseInt(e.target.value) || 0)
                        }
                      />
                      <span>FCFA</span>
                    </div>
                    <span className="font-medium text-red-500">
                      -{discount} FCFA
                    </span>
                  </div>

                  <div className="flex justify-between pt-3 border-t">
                    <span className="font-semibold">Net à payer:</span>
                    <span className="font-bold text-lg">{total} FCFA</span>
                  </div>
                </div>

                <Button className="w-full mt-6 bg-[#018a8c] hover:bg-[#017a7c]">
                  Enregistrer la vaccination
                </Button>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Aucun vaccin sélectionné</p>
                <p className="text-sm">
                  Sélectionnez des vaccins dans la liste
                </p>
              </div>
            )}
          </div>

          {/* Résumé patient */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-[#018a8c] mb-4">
              Résumé patient
            </h2>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="bg-[#018a8c] p-2 rounded-full text-white">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">
                    {patient.title} {patient.fullName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {patient.age.years} ans, {patient.age.months} mois,{" "}
                    {patient.age.days} jours
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Droplet className="h-4 w-4 text-[#018a8c]" />
                  <span>{patient.bloodGroup}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-[#018a8c]" />
                  <span>{patient.gender}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-[#018a8c]" />
                  <span>{patient.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-[#018a8c]" />
                  <span className="truncate">{patient.address}</span>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t grid grid-cols-3 gap-2 text-sm">
                <div className="text-center">
                  <p className="font-medium">{patient.height} cm</p>
                  <p className="text-xs text-muted-foreground">Taille</p>
                </div>
                <div className="text-center">
                  <p className="font-medium">{patient.weight} kg</p>
                  <p className="text-xs text-muted-foreground">Poids</p>
                </div>
                <div className="text-center">
                  <p className="font-medium">{patient.headCircumference} cm</p>
                  <p className="text-xs text-muted-foreground">PC</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
