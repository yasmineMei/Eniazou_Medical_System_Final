// components/RendezVousPDF.tsx
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logo from "@/images/logo.png"; // Assurez-vous d'avoir un logo dans le dossier images

// Styles pour le PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    borderBottom: "1px solid #018a8c",
    paddingBottom: 10,
  },
  logo: {
    width: 100,
    height: 50,
  },
  clinicInfo: {
    textAlign: "right",
    fontSize: 10,
    color: "#666",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#018a8c",
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#018a8c",
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    color: "#333",
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  column: {
    width: "48%",
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
});

// Type pour les données du rendez-vous
type RendezVous = {
  id: number;
  patient: {
    nom: string;
    prenom: string;
    dateNaissance: string;
    sexe: string;
    telephone: string;
    adresse: string;
    dossierMedical?: string; // Optionnel
  };
  date: string;
  heure: string;
  motif: string;
  statut: string;
  medecin: {
    nom: string;
    specialite: string;
    telephone: string;
  };
  clinique: {
    nom: string;
    adresse: string;
    telephone: string;
    email: string;
  };
  paiement?: {
    cout: number;
    mode: string;
    statut: string;
  };
  notes?: string;
  instructions?: string;
};

// Props pour le composant
type RendezVousPDFProps = {
  rendezVous: RendezVous;
};

// Composant principal
export const RendezVousPDF = ({ rendezVous }: RendezVousPDFProps) => (
  <Document>
    <Page style={styles.page}>
      {/* En-tête avec le logo et les informations de la clinique */}
      <View style={styles.header}>
        <Image src={logo} style={styles.logo} />
        <View style={styles.clinicInfo}>
          <Text>{rendezVous.clinique.nom}</Text>
          <Text>{rendezVous.clinique.adresse}</Text>
          <Text>Tél: {rendezVous.clinique.telephone}</Text>
          <Text>Email: {rendezVous.clinique.email}</Text>
        </View>
      </View>

      {/* Titre du document */}
      <Text style={styles.title}>Fiche de Rendez-vous</Text>

      {/* Informations du patient */}
      <View style={styles.section}>
        <Text style={styles.heading}>Informations du Patient</Text>
        <View style={styles.grid}>
          <View style={styles.column}>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Nom:</Text>{" "}
              {rendezVous.patient.nom}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Prénom:</Text>{" "}
              {rendezVous.patient.prenom}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Date de Naissance:</Text>{" "}
              {rendezVous.patient.dateNaissance}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Sexe:</Text>{" "}
              {rendezVous.patient.sexe}
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Téléphone:</Text>{" "}
              {rendezVous.patient.telephone}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Adresse:</Text>{" "}
              {rendezVous.patient.adresse}
            </Text>
            {rendezVous.patient.dossierMedical && (
              <Text style={styles.text}>
                <Text style={{ fontWeight: "bold" }}>Dossier Médical:</Text>{" "}
                {rendezVous.patient.dossierMedical}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Informations sur le rendez-vous */}
      <View style={styles.section}>
        <Text style={styles.heading}>Informations sur le Rendez-vous</Text>
        <View style={styles.grid}>
          <View style={styles.column}>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Référence:</Text>{" "}
              {rendezVous.id}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Date:</Text>{" "}
              {rendezVous.date}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Heure:</Text>{" "}
              {rendezVous.heure}
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Motif:</Text>{" "}
              {rendezVous.motif}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Statut:</Text>{" "}
              {rendezVous.statut}
            </Text>
          </View>
        </View>
      </View>

      {/* Informations du médecin */}
      <View style={styles.section}>
        <Text style={styles.heading}>Informations du Médecin</Text>
        <View style={styles.grid}>
          <View style={styles.column}>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Nom:</Text>{" "}
              {rendezVous.medecin.nom}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Spécialité:</Text>{" "}
              {rendezVous.medecin.specialite}
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Téléphone:</Text>{" "}
              {rendezVous.medecin.telephone}
            </Text>
          </View>
        </View>
      </View>

      {/* Informations de paiement (si applicable) */}
      {rendezVous.paiement && (
        <View style={styles.section}>
          <Text style={styles.heading}>Informations de Paiement</Text>
          <View style={styles.grid}>
            <View style={styles.column}>
              <Text style={styles.text}>
                <Text style={{ fontWeight: "bold" }}>Coût:</Text>{" "}
                {rendezVous.paiement.cout} FCFA
              </Text>
              <Text style={styles.text}>
                <Text style={{ fontWeight: "bold" }}>Mode de Paiement:</Text>{" "}
                {rendezVous.paiement.mode}
              </Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.text}>
                <Text style={{ fontWeight: "bold" }}>Statut:</Text>{" "}
                {rendezVous.paiement.statut}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Notes et remarques */}
      {(rendezVous.notes || rendezVous.instructions) && (
        <View style={styles.section}>
          <Text style={styles.heading}>Notes et Remarques</Text>
          {rendezVous.instructions && (
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Instructions:</Text>{" "}
              {rendezVous.instructions}
            </Text>
          )}
          {rendezVous.notes && (
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Notes:</Text>{" "}
              {rendezVous.notes}
            </Text>
          )}
        </View>
      )}

      {/* Signature et tampon */}
      <View style={styles.section}>
        <Text style={styles.heading}>Signature et Tampon</Text>
        <Text style={styles.text}>
          <Text style={{ fontWeight: "bold" }}>Signature du Médecin:</Text>{" "}
          ___________________________
        </Text>
        <Text style={styles.text}>
          <Text style={{ fontWeight: "bold" }}>Tampon de la Clinique:</Text>{" "}
          [Tampon ici]
        </Text>
      </View>

      {/* Pied de page */}
      <View style={styles.footer}>
        <Text>{rendezVous.clinique.nom} - Tous droits réservés © 2023</Text>
        <Text>Page 1 sur 1</Text>
      </View>
    </Page>
  </Document>
);
