"use client";

import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { toast } from "sonner";

export const Route = createFileRoute("/_ipd/profil-ipd")({
  component: ProfilePage,
});

function ProfilePage() {
  const [name, setName] = useState("Kengani Alphonse");
  const [email, setEmail] = useState("kengani@eniazou.com");
  const [phone, setPhone] = useState("+225 01 23 45 67 89");
  const [profileImage, setProfileImage] = useState("/avatars/admin.jpg");
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSave = () => {
    // Logique pour enregistrer les modifications
    toast.success("Profil mis à jour avec succès !");
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-1 flex-col gap-4 p-4 pt-0"
    >
      <h1 className="text-2xl font-bold">Profil</h1>

      {/* Informations personnelles */}
      <motion.div whileHover={{ scale: 1.02 }}>
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={profileImage} alt="Photo de profil" />
                <AvatarFallback>KA</AvatarFallback>
              </Avatar>
              <input
                type="file"
                id="profileImage"
                className="hidden"
                onChange={handleImageChange}
              />
              <label htmlFor="profileImage">
                <Button variant="outline" asChild>
                  <span>Changer la photo</span>
                </Button>
              </label>
            </div>
            <div>
              <Label>Nom et prénom</Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label>Numéro de téléphone</Label>
              <Input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sécurité du compte */}
      <motion.div whileHover={{ scale: 1.02 }}>
        <Card>
          <CardHeader>
            <CardTitle>Sécurité du compte</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Changer le mot de passe</Label>
              <Button variant="outline">Modifier le mot de passe</Button>
            </div>
            <div className="flex items-center justify-between">
              <Label>Authentification à deux facteurs (2FA)</Label>
              <Switch
                checked={twoFactorAuth}
                onCheckedChange={setTwoFactorAuth}
              />
            </div>
            <div>
              <Label>Historique des connexions</Label>
              <div className="text-sm text-muted-foreground">
                <p>Dernière connexion : 15 octobre 2023 à 14:30</p>
                <p>Connexion précédente : 14 octobre 2023 à 09:15</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Préférences */}
      <motion.div whileHover={{ scale: 1.02 }}>
        <Card>
          <CardHeader>
            <CardTitle>Préférences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Activer les notifications</Label>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
            <div>
              <Label>Langue</Label>
              <Select defaultValue="fr">
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une langue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">Anglais</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Informations sur le compte */}
      <motion.div whileHover={{ scale: 1.02 }}>
        <Card>
          <CardHeader>
            <CardTitle>Informations sur le compte</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Date de création du compte</Label>
              <p className="text-sm text-muted-foreground">1 janvier 2023</p>
            </div>
            <div>
              <Label>Rôle</Label>
              <p className="text-sm text-muted-foreground">Administrateur</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bouton pour enregistrer les modifications */}
      <div className="flex justify-end">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleSave}
            className="bg-[#018a8cff] hover:bg-[#016a6cff]"
          >
            Enregistrer les modifications
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
