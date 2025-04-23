"use client";

import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { BedSingle } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import logo from "@/images/logo.png";

// Schéma de validation avec Zod
const patientSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().min(1, "Le nom complet est requis"),
    birthDate: z.date(),
    gender: z.enum(["Masculin", "Féminin", "Autre"]),
    phone: z.string().min(10, "Un numéro de téléphone valide est requis"),
    profession: z.string().min(1, "La profession est requise"),
    
  }),
  hospitalization: z.object({
    admissionDate: z.date(),
    admissionTime: z.string(),
    service: z.string().min(1, "Le service est requis"),
    room: z.string().min(1, "La chambre est requise"),
    reason: z.string().min(1, "Le motif est requis"),
    doctor: z.string().min(1, "Le médecin référent est requis"),
  }),
  guardian: z.object({
    fullName: z.string().min(1, "Le nom complet est requis"),
    phone: z.string().min(10, "Un numéro de téléphone valide est requis"),
    relationship: z.string().min(1, "Le lien de parenté est requis"),
  }),
  billing: z.object({
    paymentMethod: z.enum(["Espèces", "Carte", "Virement", "Assurance"]),
    initialPayment: z.number().min(0, "Le montant doit être positif"),
    firstPaymentDate: z.date().optional(),
    additionalPayments: z
      .array(
        z.object({
          amount: z.number().min(0),
          date: z.date(),
        })
      )
      .optional(),
    stayCost: z.number().min(0, "Le coût doit être positif"),
    stayDuration: z.number().min(1, "La durée doit être d'au moins 1 jour"),
    dischargeDate: z.date().optional(),
    refund: z.number().min(0).optional(),
    remainingBalance: z.number().optional(),
  }),
});

// Données simulées pour les chambres
const roomsData = [
  { id: "101", type: "Standard", status: "Disponible" },
  { id: "102", type: "Standard", status: "Occupé" },
  { id: "201", type: "Standard", status: "Disponible" },
  { id: "202", type: "Standard", status: "Disponible" },
  { id: "301", type: "Standard", status: "Disponible" },
  { id: "302", type: "Privé", status: "Occupé" },
  { id: "203", type: "Privé", status: "Disponible" },
  { id: "301", type: "Privé", status: "Disponible" },
  { id: "302", type: "Privé", status: "Occupé" },
];

export const Route = createFileRoute("/_ipd/registration-ipd")({
  component: RegistrationPage,
});

function RegistrationPage() {
  const form = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      personalInfo: {
        fullName: "",
        birthDate: new Date(),
        gender: "Masculin",
        phone: "",
        profession: "",
      },
      hospitalization: {
        admissionDate: new Date(),
        admissionTime: "",
        service: "",
        room: "",
        reason: "",
        doctor: "",
      },
      guardian: {
        fullName: "",
        phone: "",
        relationship: "",
      },
      billing: {
        paymentMethod: "Espèces",
        initialPayment: 0,
        stayCost: 0,
        stayDuration: 1,
      },
    },
  });

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const onSubmit = (data: z.infer<typeof patientSchema>) => {
    console.log("Données du patient:", data);
    // Calculer l'âge
    const age = calculateAge(data.personalInfo.birthDate);
    // Calculer le reste à payer
    const remainingBalance =
      data.billing.stayCost - data.billing.initialPayment;

    const formData = {
      ...data,
      personalInfo: {
        ...data.personalInfo,
        age,
      },
      billing: {
        ...data.billing,
        remainingBalance,
      },
    };

    printAdmissionForm(formData);
  };

  const printAdmissionForm = (data: any) => {
    const printWindow = window.open("", "_blank");

    if (printWindow) {
      printWindow.document.write(`
      <html>
        <head>
          <title>Fiche d'Admission - Clinique Eniazou</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');
             
            body { 
              font-family: 'Montserrat', Arial, sans-serif;
              padding: 40px 60px; 
              line-height: 1.6;
              color: #333;
              background-color: #f9f9f9;
            }

            .watermark {
              position: absolute;
              opacity: 0.1;
              font-size: 120px;
              font-weight: bold;
              color: #018a8c;
              transform: rotate(-30deg);
              pointer-events: none;
              z-index: 0;
              top: 30%;
              left: 20%;
            }

            .header { 
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #018a8c;
              position: relative;
              z-index: 1;
            }

            .logo img {
              max-height: 100px;
              filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
            }

            .clinic-info {
              text-align: right;
            }

            .clinic-name { 
              font-size: 14px; 
              font-weight: 500; 
              color: #018a8c;
              margin-bottom: 5px;
              letter-spacing: 0.5px;
            }

            .clinic-details {
              font-size: 14px; 
              color: #666;
              line-height: 1.4;
            }

            .section { margin-bottom: 30px; }

            .section h2 {
              color: #018a8c;
              border-bottom: 1px solid #018a8c;
              padding-bottom: 5px;
              font-size: 15px; /* Taille réduite */
            }

            .document-title {
              display: flex;
              justify-content: center;
              align-items: center;
             
            }


            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 12px; /* Taille réduite */ }

            .info-item { margin-bottom: 10px; }

            .info-label { font-weight: bold; }

            .footer { 
              margin-top: 80px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }

            .footer-sign {
              text-align: center;
              margin-top: 60px;
              font-weight: bold;
            }

            .signature-line {
              width: 250px;
              height: 1px;
              background-color: #333;
              margin: 20px auto;
            }

            .footer-note {
              font-size: 12px;
              color: #888;
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e1e1e1;
            }

            strong {
              font-weight: 600;
            }

            .seal {
              position: absolute;
              right: 50px;
              bottom: 50px;
              opacity: 0.8;
              width: 80px;
            }

            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="watermark">CLINIQUE ENIAZOU</div>
          <div class="header">
            <div class="logo">
              <img src="${logo}" alt="Logo Clinique Eniazou">
            </div>
            <div class="clinic-info">
              <div class="clinic-name">CLINIQUE MÉDICALE ENIAZOU</div>
              <div class="clinic-details">
                Abidjan, Yopougon Selmer<br>
                Côte d'Ivoire<br>
                Tél: +225 07 08 39 77 87<br>
                Email: cliniqueeniazou@gmail.com
              </div>
            </div>
          </div>

          <h2 class="document-title">Fiche d'Admission</h2>

          <div class="section">
            <h2>Informations Personnelles</h2>
            <div class="info-grid">
              <div class="info-item"><span class="info-label">Nom complet:</span> ${data.personalInfo.fullName}</div>
              <div class="info-item"><span class="info-label">Âge:</span> ${data.personalInfo.age} ans</div>
              <div class="info-item"><span class="info-label">Sexe:</span> ${data.personalInfo.gender}</div>
              <div class="info-item"><span class="info-label">Téléphone:</span> ${data.personalInfo.phone}</div>
              <div class="info-item"><span class="info-label">Profession:</span> ${data.personalInfo.profession}</div>
            </div>
          </div>

          <div class="section">
            <h2>Détails de l'Hospitalisation</h2>
            <div class="info-grid">
              <div class="info-item"><span class="info-label">Date d'admission:</span> ${format(new Date(data.hospitalization.admissionDate), "PPPP", { locale: fr })}</div>
              <div class="info-item"><span class="info-label">Heure d'admission:</span> ${data.hospitalization.admissionTime}</div>
              <div class="info-item"><span class="info-label">Service/Département:</span> ${data.hospitalization.service}</div>
              <div class="info-item"><span class="info-label">Chambre:</span> ${data.hospitalization.room}</div>
              <div class="info-item"><span class="info-label">Médecin référent:</span> ${data.hospitalization.doctor}</div>
              <div class="info-item"><span class="info-label">Motif:</span> ${data.hospitalization.reason}</div>
            </div>
          </div>

          <div class="section">
            <h2>Tuteur/Responsable</h2>
            <div class="info-grid">
              <div class="info-item"><span class="info-label">Nom complet:</span> ${data.guardian.fullName}</div>
              <div class="info-item"><span class="info-label">Téléphone:</span> ${data.guardian.phone}</div>
              <div class="info-item"><span class="info-label">Lien de parenté:</span> ${data.guardian.relationship}</div>
            </div>
          </div>

          <div class="section">
            <h2>Informations de Facturation</h2>
            <div class="info-grid">
              <div class="info-item"><span class="info-label">Mode de paiement:</span> ${data.billing.paymentMethod}</div>
              <div class="info-item"><span class="info-label">Montant payé:</span> ${data.billing.initialPayment.toLocaleString()} FCFA</div>
              <div class="info-item"><span class="info-label">Coût du séjour:</span> ${data.billing.stayCost.toLocaleString()} FCFA</div>
              <div class="info-item"><span class="info-label">Durée du séjour:</span> ${data.billing.stayDuration} jours</div>
              <div class="info-item"><span class="info-label">Reste à payer:</span> ${data.billing.remainingBalance?.toLocaleString() || "0"} FCFA</div>
            </div>
          </div>

          <div class="footer">
            <p class="footer-sign">Signature du responsable</p>
            <p>Fait à Abidjan le ${format(new Date(), "PPPP", { locale: fr })}</p>
          </div>

          <img class="seal" src="data:image/svg+xml;base64,..." alt="Sceau médical">

          <div class="footer-note">
            - Document officiel - Tous droits réservés © ${new Date().getFullYear()} Clinique Médicale Eniazou -
          </div>

          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 500);
          </script>
        </body>
      </html>
    `);

      printWindow.document.close();
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-[#018a8c] mb-6">
        Enregistrement des Patients Hospitalisés
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Section Informations Personnelles */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-[#018a8c]">
              Informations Personnelles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="personalInfo.fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom Complet</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom et prénoms" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="personalInfo.birthDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de Naissance</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className="pl-3 text-left font-normal"
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: fr })
                            ) : (
                              <span>Choisir une date</span>
                            )}
                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="personalInfo.gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sexe</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le sexe" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Masculin">Masculin</SelectItem>
                        <SelectItem value="Féminin">Féminin</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="personalInfo.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input placeholder="+225 XX XX XX XX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="personalInfo.profession"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profession</FormLabel>
                    <FormControl>
                      <Input placeholder="Profession" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
          </div>

          {/* Section Hospitalisation */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-[#018a8c]">
              Détails de l'Hospitalisation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="hospitalization.admissionDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date d'Admission</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className="pl-3 text-left font-normal"
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: fr })
                            ) : (
                              <span>Choisir une date</span>
                            )}
                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hospitalization.admissionTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure d'Admission</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hospitalization.service"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service/Département</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Chirurgie, Pédiatrie..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hospitalization.doctor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Médecin Référent</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom du médecin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hospitalization.room"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chambre</FormLabel>
                    <Dialog>
                      <DialogTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                          >
                            <BedSingle className="mr-2 h-4 w-4" />
                            {field.value || "Sélectionner une chambre"}
                          </Button>
                        </FormControl>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <h3 className="text-lg font-semibold mb-4">
                          Sélection de la chambre
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {roomsData.map((room) => (
                            <Card
                              key={room.id}
                              className={`p-4 cursor-pointer ${
                                room.status === "Occupé"
                                  ? "bg-gray-100 border-red-200"
                                  : "hover:border-[#018a8c]"
                              } ${
                                field.value === room.id
                                  ? "border-2 border-[#018a8c]"
                                  : ""
                              }`}
                              onClick={() => {
                                if (room.status !== "Occupé") {
                                  field.onChange(room.id);
                                }
                              }}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <h4 className="font-medium">
                                    Chambre {room.id}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    Type: {room.type}
                                  </p>
                                </div>
                                <span
                                  className={`text-sm ${
                                    room.status === "Disponible"
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {room.status}
                                </span>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hospitalization.reason"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Motif de l'Hospitalisation</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Décrivez le motif de l'hospitalisation..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Section Tuteur/Responsable */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-[#018a8c]">
              Identification du Tuteur/Responsable
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="guardian.fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom Complet</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom et prénoms" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="guardian.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input placeholder="+225 XX XX XX XX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              

              <FormField
                control={form.control}
                name="guardian.relationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lien de Parenté</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Père, Mère, Tuteur..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Section Facturation */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-[#018a8c]">
              Informations de Facturation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="billing.paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mode de Paiement</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le mode de paiement" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Espèces">Espèces</SelectItem>
                        <SelectItem value="Carte">Carte</SelectItem>
                        <SelectItem value="Virement">Virement</SelectItem>
                        <SelectItem value="Assurance">Assurance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="billing.initialPayment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant payé à l'admission (FCFA)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Montant"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="billing.stayCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coût du séjour (FCFA)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Coût estimé"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="billing.stayDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durée estimée du séjour (jours)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="Nombre de jours"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">
              Annuler
            </Button>
            <Button type="submit" className="bg-[#018a8c] hover:bg-[#017a7c]">
              Enregistrer et Imprimer
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
