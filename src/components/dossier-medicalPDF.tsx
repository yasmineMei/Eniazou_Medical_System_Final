// components/DossierMedicalPDF.tsx
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import logo from "@/images/logo.png"; // Assurez-vous d'avoir un logo dans le dossier images

// Charger une police personnalisée (optionnel)
Font.register({
  family: "Helvetica-Bold",
  src: "https://fonts.gstatic.com/s/helvetica/v15/Helvetica-Bold.ttf",
});

// Styles pour le PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    backgroundColor: "#f7f7f7", // Fond légèrement gris pour un look moderne
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: "2px solid #018a8c", // Ligne de séparation stylisée
  },
  logo: {
    width: 120,
    height: 120,
  },
  clinicInfo: {
    textAlign: "right",
    fontSize: 10,
    color: "#666",
    lineHeight: 1.5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#018a8c",
    textAlign: "center",
    marginBottom: 20,
    textTransform: "uppercase", // Titre en majuscules pour plus d'impact
  },
  section: {
    marginBottom: 20,
    backgroundColor: "#ffffff", // Fond blanc pour chaque section
    padding: 15,
    borderRadius: 8, // Bordures arrondies
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Ombre légère
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#018a8c",
    borderBottom: "1px solid #e0e0e0", // Ligne de séparation sous le titre
    paddingBottom: 5,
  },
  text: {
    fontSize: 12,
    marginBottom: 8,
    color: "#333",
    lineHeight: 1.5,
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  column: {
    width: "48%",
  },
  separator: {
    borderBottom: "1px solid #e0e0e0",
    marginVertical: 15,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 10,
    color: "#666",
    textAlign: "center",
    borderTop: "1px solid #e0e0e0",
    paddingTop: 10,
  },
  disclaimer: {
    fontSize: 10,
    color: "#666",
    marginTop: 20,
    textAlign: "justify",
    lineHeight: 1.5,
  },
  highlight: {
    backgroundColor: "#018a8c",
    color: "#ffffff",
    padding: 5,
    borderRadius: 4,
  },
});

type Patient = {
  nom: string;
  prenom: string;
  birthDate: string;
  birthPlace: string;
  numberPhone: string;
  blood: string;
  genre: string;
  dossierMedical: string;
  age: number;
  diabete: boolean;
  cancer: boolean;
  hypertension: boolean;
  hemorroides: boolean;
  drepanocytose: boolean;
  hepatite: boolean;
  varicelle: boolean;
  tuberculose: boolean;
  asthme: boolean;
  chirurgieAnterieure: boolean;
  medicationActuelle: string;
  vaccination: string;
  grossesse: boolean;
  avortement: boolean;
  allergies: string;
};

type DossierMedicalPDFProps = {
  patient: Patient;
};

export const DossierMedicalPDF = ({ patient }: DossierMedicalPDFProps) => (
  <Document>
    <Page style={styles.page}>
      {/* En-tête avec le logo et les informations de la clinique */}
      <View style={styles.header}>
        <Image src={logo} style={styles.logo} />
        <View style={styles.clinicInfo}>
          <Text style={{ fontWeight: "bold" }}>Clinique Médicale Eniazou</Text>
          <Text>123 Rue de la Santé, Abidjan, Côte d'Ivoire</Text>
          <Text>Tél: +225 01 23 45 67 89</Text>
          <Text>Email: contact@eniazou.com</Text>
        </View>
      </View>

      {/* Titre du document */}
      <Text style={styles.title}>Dossier Médical</Text>

      {/* Introduction */}
      <View style={styles.section}>
        <Text style={styles.text}>
          Ce dossier médical contient les informations personnelles et médicales
          de{" "}
          <Text style={styles.highlight}>
            {patient.nom} {patient.prenom}
          </Text>
          . Il est strictement confidentiel et ne peut être partagé sans
          l'autorisation écrite du patient ou de son représentant légal.
        </Text>
      </View>

      {/* Informations personnelles */}
      <View style={styles.section}>
        <Text style={styles.heading}>Informations Personnelles</Text>
        <View style={styles.grid}>
          <View style={styles.column}>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Nom:</Text> {patient.nom}{" "}
              {patient.prenom}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Date de naissance:</Text>{" "}
              {patient.birthDate}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Lieu de naissance:</Text>{" "}
              {patient.birthPlace}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Téléphone:</Text>{" "}
              {patient.numberPhone}
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Genre:</Text> {patient.genre}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Âge:</Text> {patient.age} ans
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Groupe sanguin:</Text>{" "}
              {patient.blood}
            </Text>
          </View>
        </View>
      </View>

      {/* Séparateur */}
      <View style={styles.separator} />

      {/* Historique médical */}
      <View style={styles.section}>
        <Text style={styles.heading}>Historique Médical</Text>
        <View style={styles.grid}>
          <View style={styles.column}>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Diabète:</Text>{" "}
              {patient.diabete ? "Oui" : "Non"}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Cancer:</Text>{" "}
              {patient.cancer ? "Oui" : "Non"}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Hypertension:</Text>{" "}
              {patient.hypertension ? "Oui" : "Non"}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Hémorroïdes:</Text>{" "}
              {patient.hemorroides ? "Oui" : "Non"}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Drépanocytose:</Text>{" "}
              {patient.drepanocytose ? "Oui" : "Non"}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Grossesse:</Text>{" "}
              {patient.grossesse ? "Oui" : "Non"}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Avortement:</Text>{" "}
              {patient.avortement ? "Oui" : "Non"}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Allergies:</Text>{" "}
              {patient.allergies || "Aucune"}
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Hépatite:</Text>{" "}
              {patient.hepatite ? "Oui" : "Non"}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Varicelle:</Text>{" "}
              {patient.varicelle ? "Oui" : "Non"}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Tuberculose:</Text>{" "}
              {patient.tuberculose ? "Oui" : "Non"}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Asthme:</Text>{" "}
              {patient.asthme ? "Oui" : "Non"}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Chirurgie Antérieure:</Text>{" "}
              {patient.chirurgieAnterieure ? "Oui" : "Non"}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Médication Actuelle:</Text>{" "}
              {patient.medicationActuelle || "Aucune"}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Vaccination:</Text>{" "}
              {patient.vaccination || "Aucune"}
            </Text>
          </View>
        </View>
      </View>

      {/* Séparateur */}
      <View style={styles.separator} />

      {/* Conditions et autorisations */}
      <View style={styles.section}>
        <Text style={styles.heading}>Conditions et Autorisations</Text>
        <Text style={styles.disclaimer}>
          Ce dossier médical est la propriété de la Clinique Médicale Eniazou.
          Il contient des informations confidentielles protégées par la loi.
          Toute divulgation, reproduction ou utilisation non autorisée est
          strictement interdite. Le patient autorise la clinique à utiliser ces
          informations dans le cadre de son traitement médical. Pour toute
          demande d'accès ou de modification, veuillez contacter la clinique.
        </Text>
      </View>

      {/* Pied de page */}
      <View style={styles.footer}>
        <Text>Clinique Médicale Eniazou - Tous droits réservés © 2023</Text>
        <Text>Page 1 sur 1</Text>
      </View>
    </Page>
  </Document>
);
