export type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
export type Gender = "Homme" | "Femme";

export interface Antecedents {
  diabete: boolean;
  cancer: boolean;
  hypertension: boolean;
  hemorroides: boolean;
  drepanocytose: boolean;
  hepatite: boolean;
  varicelle: boolean;
  tuberculose: boolean;
  asthme: boolean;
  vaccination: string;
  grossesse: boolean;
  avortement: boolean;
  allergies: string;
}

export interface Chirurgie {
  id: number;
  type: string;
  date: string;
  notes: string;
}

export interface Medicament {
  id: number;
  nom: string;
  dosage: string;
  frequence: string;
  depuis: string;
  pour: string;
}

export interface Patient {
  id: string;
  nom: string;
  prenom: string;
  birthDate: string;
  birthPlace: string;
  numberPhone: string;
  poids: string;
  taille: string;
  blood: BloodType;
  genre: Gender;
  dossierMedical: string;
  age: number;
  antecedents: Antecedents;
  chirurgies: Chirurgie[];
  medicaments: Medicament[];
}
