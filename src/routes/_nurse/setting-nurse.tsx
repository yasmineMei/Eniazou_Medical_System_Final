"use client";

import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_nurse/setting-nurse")({
  component: SettingsPage,
});

function SettingsPage() {
  const [clinicName, setClinicName] = useState("Clinique Eniazou");
  const [clinicAddress, setClinicAddress] = useState(
    "123 Rue de la Santé, Abidjan"
  );
  const [clinicPhone, setClinicPhone] = useState("+225 01 23 45 67 89");
  const [clinicEmail, setClinicEmail] = useState("contact@eniazou.com");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const handleSave = () => {
    // Logique pour enregistrer les modifications
    console.log("Paramètres enregistrés !");
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <h1 className="text-2xl font-bold">Paramètres</h1>

      {/* Informations de la clinique */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de la clinique</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Nom de la clinique</Label>
            <Input
              type="text"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
            />
          </div>
          <div>
            <Label>Adresse</Label>
            <Input
              type="text"
              value={clinicAddress}
              onChange={(e) => setClinicAddress(e.target.value)}
            />
          </div>
          <div>
            <Label>Numéro de téléphone</Label>
            <Input
              type="text"
              value={clinicPhone}
              onChange={(e) => setClinicPhone(e.target.value)}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={clinicEmail}
              onChange={(e) => setClinicEmail(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Paramètres utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres utilisateurs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Rôle par défaut</Label>
            <Select defaultValue="admin">
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrateur</SelectItem>
                <SelectItem value="doctor">Médecin</SelectItem>
                <SelectItem value="nurse">Infirmier</SelectItem>
                <SelectItem value="reception">Réceptionniste</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Réinitialiser les mots de passe</Label>
            <Button variant="outline">
              Réinitialiser tous les mots de passe
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Paramètres système */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres système</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Activer les notifications</Label>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Authentification à deux facteurs</Label>
            <Switch
              checked={twoFactorAuth}
              onCheckedChange={setTwoFactorAuth}
            />
          </div>
          <div>
            <Label>Sauvegarde des données</Label>
            <Button variant="outline">Lancer une sauvegarde</Button>
          </div>
        </CardContent>
      </Card>

      {/* Informations sur la version */}
      <Card>
        <CardHeader>
          <CardTitle>Informations sur la version</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Version actuelle</Label>
            <p className="text-sm text-muted-foreground">v1.2.3</p>
          </div>
          <div>
            <Label>Dernière mise à jour</Label>
            <p className="text-sm text-muted-foreground">15 octobre 2023</p>
          </div>
          <Button variant="outline">Vérifier les mises à jour</Button>
        </CardContent>
      </Card>

      {/* Bouton pour enregistrer les modifications */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className="bg-[#018a8cff] hover:bg-[#016a6cff]"
        >
          Enregistrer les modifications
        </Button>
      </div>
    </div>
  );
}
