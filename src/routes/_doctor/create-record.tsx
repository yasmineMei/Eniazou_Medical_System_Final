import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

// Schéma de validation avec Zod
const medicalRecordSchema = z.object({
  patientId: z.string().min(1, "L'identifiant du patient est requis"),
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom de famille est requis"),
  birthDate: z.string().min(1, "La date de naissance est requise"),
  birthPlace: z.string().min(1, "Le lieu de naissance est requis"),
  gender: z.enum(["male", "female", "other"]),
  phoneNumber: z
    .string()
    .min(10, "Le numéro de téléphone doit avoir au moins 10 caractères"),
  bloodType: z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .optional(),
  weight: z.string().min(1, "Le poids est requis"),
  height: z.string().min(1, "La taille est requise"),
  allergies: z.string().optional(),
  medications: z.string().optional(),
  medicalHistory: z.string().optional(),
  familyHistory: z.string().optional(),
  vaccinations: z.string().optional(),
});

type MedicalRecordFormData = z.infer<typeof medicalRecordSchema>;

export const Route = createFileRoute("/_doctor/create-record")({
  component: CreateMedicalRecordPage,
});

function CreateMedicalRecordPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    //control,
  } = useForm<MedicalRecordFormData>({
    resolver: zodResolver(medicalRecordSchema),
    defaultValues: {
      gender: "male",
    },
  });

  const onSubmit = async (data: MedicalRecordFormData) => {
    setIsSubmitting(true);
    try {
      // Ici vous feriez normalement un appel API pour enregistrer le dossier
      console.log("Données du dossier médical:", data);
      // Simuler un délai d'envoi
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Dossier médical créé avec succès");
      reset(); // Réinitialiser le formulaire après soumission
      navigate({ to: "/patient-doctor" }); // Rediriger vers la liste des patients
    } catch (error) {
      console.error("Erreur lors de la création du dossier:", error);
      toast.error("Une erreur est survenue lors de la création du dossier");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-6 bg-gray-50">
      {/* Bouton Retour */}
      <Button
        variant="ghost"
        onClick={() => navigate({ to: "/patient-doctor" })}
        className="self-start mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour à la liste
      </Button>

      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#018a8c]">
          Créer un nouveau dossier médical
        </h1>
      </div>

      {/* Formulaire */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Informations du patient</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Section informations patient */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="patientId">ID Patient *</Label>
                  <Input
                    id="patientId"
                    {...register("patientId")}
                    placeholder="DM12345"
                  />
                  {errors.patientId && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.patientId.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    {...register("firstName")}
                    placeholder="Jean"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input
                    id="lastName"
                    {...register("lastName")}
                    placeholder="Dupont"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="birthDate">Date de naissance *</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    {...register("birthDate")}
                  />
                  {errors.birthDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.birthDate.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="birthPlace">Lieu de naissance *</Label>
                  <Input
                    id="birthPlace"
                    {...register("birthPlace")}
                    placeholder="Abidjan"
                  />
                  {errors.birthPlace && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.birthPlace.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Section informations médicales */}
              <div className="space-y-4">
                <div>
                  <Label>Sexe *</Label>
                  <select
                    {...register("gender")}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  >
                    <option value="male">Homme</option>
                    <option value="female">Femme</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="phoneNumber">Numéro de téléphone *</Label>
                  <Input
                    id="phoneNumber"
                    {...register("phoneNumber")}
                    placeholder="+225 01 23 45 67 89"
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="bloodType">Groupe sanguin</Label>
                  <Select {...register("bloodType")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez..." />
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weight">Poids (kg) *</Label>
                    <Input
                      id="weight"
                      {...register("weight")}
                      placeholder="70"
                    />
                    {errors.weight && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.weight.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="height">Taille (cm) *</Label>
                    <Input
                      id="height"
                      {...register("height")}
                      placeholder="175"
                    />
                    {errors.height && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.height.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Section antécédents */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Antécédents médicaux</h3>

              <div>
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  id="allergies"
                  {...register("allergies")}
                  placeholder="Liste des allergies connues..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="medications">Médicaments actuels</Label>
                <Textarea
                  id="medications"
                  {...register("medications")}
                  placeholder="Liste des médicaments pris régulièrement..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="medicalHistory">Antécédents médicaux</Label>
                <Textarea
                  id="medicalHistory"
                  {...register("medicalHistory")}
                  placeholder="Maladies chroniques, interventions chirurgicales..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="familyHistory">Antécédents familiaux</Label>
                <Textarea
                  id="familyHistory"
                  {...register("familyHistory")}
                  placeholder="Maladies héréditaires dans la famille..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="vaccinations">Vaccinations</Label>
                <Textarea
                  id="vaccinations"
                  {...register("vaccinations")}
                  placeholder="Liste des vaccins reçus..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#018a8c] hover:bg-[#016a6c]"
              >
                {isSubmitting ? "Enregistrement..." : "Créer le dossier"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
