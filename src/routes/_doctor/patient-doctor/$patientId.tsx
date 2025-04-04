import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { DossierMedicalPDF } from "@/pdf/dossier-medicalPDF";
import { motion } from "framer-motion";
import {
  Edit,
  Save,
  Pill,
  ClipboardList,
  User,
  SliceIcon,
  ArrowLeft,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { usePatients } from "@/hooks/usePatients";
import { Patient, Chirurgie, Medicament } from "@/types/patient";

export const Route = createFileRoute("/_doctor/patient-doctor/$patientId")({
  component: PatientDetails,
});

function PatientDetails() {
  const { patientId } = Route.useParams();
  const navigate = useNavigate();
  const { getPatient, updatePatient } = usePatients();
  const [isEditing, setIsEditing] = useState(false);
  const [patient, setPatient] = useState<Patient | undefined>(() =>
    getPatient(patientId)
  );
  const [newChirurgie, setNewChirurgie] = useState<Omit<Chirurgie, "id">>({
    type: "",
    date: "",
    notes: "",
  });
  const [newMedicament, setNewMedicament] = useState<Omit<Medicament, "id">>({
    nom: "",
    dosage: "",
    frequence: "",
    depuis: "",
    pour: "",
  });

  if (!patient) {
    return (
      <div className="flex flex-col min-h-screen p-6 bg-gray-50">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: "/patient-doctor" })}
          className="self-start mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-lg">Patient non trouvé</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  const handleAntecedentChange = (
    field: keyof Patient["antecedents"],
    value: any
  ) => {
    setPatient({
      ...patient,
      antecedents: {
        ...patient.antecedents,
        [field]: value,
      },
    });
  };

  const handleNewChirurgieChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewChirurgie({
      ...newChirurgie,
      [name]: value,
    });
  };

  const handleNewMedicamentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewMedicament({
      ...newMedicament,
      [name]: value,
    });
  };

  const addNewChirurgie = () => {
    const chirurgie: Chirurgie = {
      id: patient.chirurgies.length + 1,
      ...newChirurgie,
    };
    const updatedPatient = {
      ...patient,
      chirurgies: [...patient.chirurgies, chirurgie],
    };
    setPatient(updatedPatient);
    updatePatient(updatedPatient);
    setNewChirurgie({ type: "", date: "", notes: "" });
  };

  const addNewMedicament = () => {
    const medicament: Medicament = {
      id: patient.medicaments.length + 1,
      ...newMedicament,
    };
    const updatedPatient = {
      ...patient,
      medicaments: [...patient.medicaments, medicament],
    };
    setPatient(updatedPatient);
    updatePatient(updatedPatient);
    setNewMedicament({
      nom: "",
      dosage: "",
      frequence: "",
      depuis: "",
      pour: "",
    });
  };

  const saveChanges = () => {
    updatePatient(patient);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Non spécifié";
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  return (
    <div className="flex flex-col min-h-screen p-6 bg-gray-50">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: "/patient-doctor" })}
        className="self-start mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour à la liste
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[#018a8c]">
          Dossier Médical - {patient.nom} {patient.prenom}
        </h1>
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant={isEditing ? "outline" : "default"}
            onClick={() => (isEditing ? saveChanges() : setIsEditing(true))}
            className="flex items-center gap-2"
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4" />
                Enregistrer
              </>
            ) : (
              <>
                <Edit className="h-4 w-4" />
                Modifier
              </>
            )}
          </Button>
          <PDFDownloadLink
            document={<DossierMedicalPDF patient={patient} />}
            fileName={`dossier_${patient.nom}_${patient.prenom}.pdf`}
          >
            {({ loading }) => (
              <Button
                variant="secondary"
                className="flex items-center gap-2"
                disabled={loading}
              >
                {loading ? "Génération..." : "Exporter PDF"}
              </Button>
            )}
          </PDFDownloadLink>
        </div>
      </div>

      <Card className="flex-1">
        <CardContent>
          <Tabs defaultValue="informations" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="informations">
                <User className="h-4 w-4 mr-2" />
                Informations
              </TabsTrigger>
              <TabsTrigger value="antecedents">
                <ClipboardList className="h-4 w-4 mr-2" />
                Antécédents
              </TabsTrigger>
              <TabsTrigger value="chirurgies">
                <SliceIcon className="h-4 w-4 mr-2" />
                Chirurgies
              </TabsTrigger>
              <TabsTrigger value="medicaments">
                <Pill className="h-4 w-4 mr-2" />
                Médicaments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="informations" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Numéro dossier</Label>
                    <p className="text-sm mt-1">{patient.dossierMedical}</p>
                  </div>
                  <div>
                    <Label>Nom</Label>
                    {isEditing ? (
                      <Input
                        name="nom"
                        value={patient.nom}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="text-sm mt-1">{patient.nom}</p>
                    )}
                  </div>
                  <div>
                    <Label>Prénom</Label>
                    {isEditing ? (
                      <Input
                        name="prenom"
                        value={patient.prenom}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="text-sm mt-1">{patient.prenom}</p>
                    )}
                  </div>
                  <div>
                    <Label>Date de naissance</Label>
                    {isEditing ? (
                      <Input
                        type="date"
                        name="birthDate"
                        value={patient.birthDate}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="text-sm mt-1">
                        {formatDate(patient.birthDate)}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Lieu de naissance</Label>
                    {isEditing ? (
                      <Input
                        name="birthPlace"
                        value={patient.birthPlace}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="text-sm mt-1">{patient.birthPlace}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Téléphone</Label>
                    {isEditing ? (
                      <Input
                        name="numberPhone"
                        value={patient.numberPhone}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="text-sm mt-1">{patient.numberPhone}</p>
                    )}
                  </div>
                  <div>
                    <Label>Genre</Label>
                    {isEditing ? (
                      <Select
                        value={patient.genre}
                        onValueChange={(value) =>
                          setPatient({
                            ...patient,
                            genre: value as "Homme" | "Femme",
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Homme">Homme</SelectItem>
                          <SelectItem value="Femme">Femme</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm mt-1">{patient.genre}</p>
                    )}
                  </div>
                  <div>
                    <Label>Groupe sanguin</Label>
                    {isEditing ? (
                      <Select
                        value={patient.blood}
                        onValueChange={(value) =>
                          setPatient({ ...patient, blood: value })
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
                    ) : (
                      <p className="text-sm mt-1">{patient.blood}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Poids (kg)</Label>
                      {isEditing ? (
                        <Input
                          name="poids"
                          value={patient.poids}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <p className="text-sm mt-1">{patient.poids} kg</p>
                      )}
                    </div>
                    <div>
                      <Label>Taille (cm)</Label>
                      {isEditing ? (
                        <Input
                          name="taille"
                          value={patient.taille}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <p className="text-sm mt-1">{patient.taille} cm</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="antecedents" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Antécédents médicaux</h3>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="diabete"
                      checked={patient.antecedents.diabete}
                      onCheckedChange={(checked) =>
                        handleAntecedentChange("diabete", checked)
                      }
                      disabled={!isEditing}
                    />
                    <Label htmlFor="diabete">Diabète</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hypertension"
                      checked={patient.antecedents.hypertension}
                      onCheckedChange={(checked) =>
                        handleAntecedentChange("hypertension", checked)
                      }
                      disabled={!isEditing}
                    />
                    <Label htmlFor="hypertension">Hypertension</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="asthme"
                      checked={patient.antecedents.asthme}
                      onCheckedChange={(checked) =>
                        handleAntecedentChange("asthme", checked)
                      }
                      disabled={!isEditing}
                    />
                    <Label htmlFor="asthme">Asthme</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hepatite"
                      checked={patient.antecedents.hepatite}
                      onCheckedChange={(checked) =>
                        handleAntecedentChange("hepatite", checked)
                      }
                      disabled={!isEditing}
                    />
                    <Label htmlFor="hepatite">Hépatite</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="tuberculose"
                      checked={patient.antecedents.tuberculose}
                      onCheckedChange={(checked) =>
                        handleAntecedentChange("tuberculose", checked)
                      }
                      disabled={!isEditing}
                    />
                    <Label htmlFor="tuberculose">Tuberculose</Label>
                  </div>

                  {patient.genre === "Femme" && (
                    <>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="grossesse"
                          checked={patient.antecedents.grossesse}
                          onCheckedChange={(checked) =>
                            handleAntecedentChange("grossesse", checked)
                          }
                          disabled={!isEditing}
                        />
                        <Label htmlFor="grossesse">Grossesse</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="avortement"
                          checked={patient.antecedents.avortement}
                          onCheckedChange={(checked) =>
                            handleAntecedentChange("avortement", checked)
                          }
                          disabled={!isEditing}
                        />
                        <Label htmlFor="avortement">Avortement</Label>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Vaccinations</Label>
                    {isEditing ? (
                      <Textarea
                        value={patient.antecedents.vaccination}
                        onChange={(e) =>
                          handleAntecedentChange("vaccination", e.target.value)
                        }
                      />
                    ) : (
                      <p className="text-sm mt-1 whitespace-pre-line">
                        {patient.antecedents.vaccination}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Allergies</Label>
                    {isEditing ? (
                      <Input
                        value={patient.antecedents.allergies}
                        onChange={(e) =>
                          handleAntecedentChange("allergies", e.target.value)
                        }
                      />
                    ) : (
                      <p className="text-sm mt-1">
                        {patient.antecedents.allergies ||
                          "Aucune allergie connue"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="chirurgies" className="mt-6">
              <div className="space-y-4">
                {patient.chirurgies.map((chirurgie) => (
                  <motion.div
                    key={chirurgie.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Type de chirurgie</Label>
                        <p>{chirurgie.type}</p>
                      </div>
                      <div>
                        <Label>Date</Label>
                        <p>{formatDate(chirurgie.date)}</p>
                      </div>
                      <div>
                        <Label>Notes</Label>
                        <p>{chirurgie.notes}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isEditing && (
                  <div className="p-4 border border-dashed border-gray-300 rounded-lg mt-4">
                    <h4 className="font-medium mb-4">Ajouter une chirurgie</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Type de chirurgie</Label>
                        <Input
                          name="type"
                          value={newChirurgie.type}
                          onChange={handleNewChirurgieChange}
                        />
                      </div>
                      <div>
                        <Label>Date</Label>
                        <Input
                          type="date"
                          name="date"
                          value={newChirurgie.date}
                          onChange={handleNewChirurgieChange}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Notes</Label>
                        <Textarea
                          name="notes"
                          value={newChirurgie.notes}
                          onChange={handleNewChirurgieChange}
                        />
                      </div>
                    </div>
                    <Button
                      onClick={addNewChirurgie}
                      disabled={!newChirurgie.type || !newChirurgie.date}
                      className="mt-4"
                    >
                      Ajouter la chirurgie
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="medicaments" className="mt-6">
              <div className="space-y-4">
                {patient.medicaments.map((medicament) => (
                  <motion.div
                    key={medicament.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label>Médicament</Label>
                        <p>{medicament.nom}</p>
                      </div>
                      <div>
                        <Label>Dosage</Label>
                        <p>{medicament.dosage}</p>
                      </div>
                      <div>
                        <Label>Fréquence</Label>
                        <p>{medicament.frequence}</p>
                      </div>
                      <div>
                        <Label>Depuis le</Label>
                        <p>{formatDate(medicament.depuis)}</p>
                      </div>
                      <div className="md:col-span-4">
                        <Label>Indication</Label>
                        <p>{medicament.pour}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isEditing && (
                  <div className="p-4 border border-dashed border-gray-300 rounded-lg mt-4">
                    <h4 className="font-medium mb-4">Ajouter un médicament</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nom du médicament</Label>
                        <Input
                          name="nom"
                          value={newMedicament.nom}
                          onChange={handleNewMedicamentChange}
                        />
                      </div>
                      <div>
                        <Label>Dosage</Label>
                        <Input
                          name="dosage"
                          value={newMedicament.dosage}
                          onChange={handleNewMedicamentChange}
                        />
                      </div>
                      <div>
                        <Label>Fréquence</Label>
                        <Input
                          name="frequence"
                          value={newMedicament.frequence}
                          onChange={handleNewMedicamentChange}
                        />
                      </div>
                      <div>
                        <Label>Depuis le</Label>
                        <Input
                          type="date"
                          name="depuis"
                          value={newMedicament.depuis}
                          onChange={handleNewMedicamentChange}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Indication/Pour</Label>
                        <Input
                          name="pour"
                          value={newMedicament.pour}
                          onChange={handleNewMedicamentChange}
                        />
                      </div>
                    </div>
                    <Button
                      onClick={addNewMedicament}
                      disabled={
                        !newMedicament.nom ||
                        !newMedicament.dosage ||
                        !newMedicament.frequence
                      }
                      className="mt-4"
                    >
                      Ajouter le médicament
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
