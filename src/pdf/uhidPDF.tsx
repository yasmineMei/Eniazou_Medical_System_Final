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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: "1px solid #e0e0e0",
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
  },
  section: {
    marginBottom: 20,
    padding: 15,
    border: "1px solid #e0e0e0",
    borderRadius: 8,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#018a8c",
    paddingBottom: 5,
    borderBottom: "1px solid #e0e0e0",
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
  table: {
    width: "100%",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #e0e0e0",
    paddingVertical: 8,
  },
  tableHeader: {
    fontWeight: "bold",
    backgroundColor: "#f5f5f5",
    padding: 8,
    textAlign: "center",
  },
  tableCell: {
    flex: 1,
    padding: 8,
    textAlign: "center",
  },
});

type Patient = {
  uhid: string;
  opdId: string;
  dob: string;
  datetime: string; // date d'enregistrement
  genre: string;
  name: string;
  phone: string;
  departement: string;
  doctor: string;
  fees: string;
  resident: string;
  temperature: string;
  pouls: string;
  taille: string;
  poids: string;
  taBrasDroit: string;
  taBrasGauche: string;
  antecedents: {
    hypertension: boolean;
    cardiaque: boolean;
    thyroide: boolean;
    sinusite: boolean;
    allergie: boolean;
    varicelle: boolean;
    hepatite: boolean;
    hemoroids: boolean;
    asthme: boolean;
    tuberculose: boolean;
  };
};

type UHIDPDFProps = {
  patient: Patient;
};

export const UHIDPDF = ({ patient }: UHIDPDFProps) => (
  <Document>
    <Page style={styles.page}>
      {/* En-tête avec le logo et les informations de la clinique */}
      <View style={styles.header}>
        <Image src={logo} style={styles.logo} />
        <View style={styles.clinicInfo}>
          <Text style={{ fontWeight: "bold" }}>Clinique Médicale Eniazou</Text>
          <Text>Yopougon-selmer près de la Coopec</Text>
          <Text>21 BP 3669 Abidjan 21</Text>
          <Text>+225 05 05788692 / 07 49043782</Text>
          <Text>Email: cliniqueeniazou@gmail.com</Text>
        </View>
      </View>

      {/* Titre du document */}
      <Text style={styles.title}>Fiche de contrôle des constantes</Text>

      {/* Informations du patient */}
      <View style={styles.section}>
        <Text style={styles.heading}>Informations du Patient</Text>
        <View style={styles.grid}>
          <View style={styles.column}>
            <Text style={styles.text}>UHID No: {patient.uhid}</Text>
            <Text style={styles.text}>Nom: {patient.name}</Text>
            <Text style={styles.text}>
              Date de naissance: {patient.dob}, Genre: {patient.genre}
            </Text>
            <Text style={styles.text}>
              Numéro de téléphone: {patient.phone}
            </Text>
            <Text style={styles.text}>Résidence: {patient.resident}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.text}>
              Date: {patient.datetime.split("T")[0]}
            </Text>
            <Text style={styles.text}>
              Heure: {patient.datetime.split("T")[1]}
            </Text>
            <Text style={styles.text}>OPD No: {patient.opdId}</Text>
            <Text style={styles.text}>Département: {patient.departement}</Text>
            <Text style={styles.text}>Médecin: {patient.doctor}</Text>
            <Text style={styles.text}>
              Frais de consultation: {patient.fees}
            </Text>
          </View>
        </View>
      </View>

      {/* Signes vitaux et investigations */}
      <View style={styles.section}>
        <Text style={styles.heading}>Signes Vitaux / Investigations</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Température</Text>
            <Text style={styles.tableCell}>Pouls</Text>
            <Text style={styles.tableCell}>Taille</Text>
            <Text style={styles.tableCell}>Poids</Text>
            <Text style={styles.tableCell}>TA Bras Droit</Text>
            <Text style={styles.tableCell}>TA Bras Gauche</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{patient.temperature}</Text>
            <Text style={styles.tableCell}>{patient.pouls}</Text>
            <Text style={styles.tableCell}>{patient.taille}</Text>
            <Text style={styles.tableCell}>{patient.poids}</Text>
            <Text style={styles.tableCell}>{patient.taBrasDroit}</Text>
            <Text style={styles.tableCell}>{patient.taBrasGauche}</Text>
          </View>
        </View>
      </View>

      {/* Antécédents médicaux */}
      <View style={styles.section}>
        <Text style={styles.heading}>Antécédents Médicaux / Diagnostic</Text>
        <View style={styles.grid}>
          <View style={styles.column}>
            <Text style={styles.text}>
              Hypertension: {patient.antecedents.hypertension ? "☑" : "☐"}
            </Text>
            <Text style={styles.text}>
              Cardiaque: {patient.antecedents.cardiaque ? "☑" : "☐"}
            </Text>
            <Text style={styles.text}>
              Thyroïde: {patient.antecedents.thyroide ? "☑" : "☐"}
            </Text>
            <Text style={styles.text}>
              Sinusite: {patient.antecedents.sinusite ? "☑" : "☐"}
            </Text>
            <Text style={styles.text}>
              Allergies: {patient.antecedents.allergie ? "☑" : "☐"}
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.text}>
              Varicelle: {patient.antecedents.varicelle ? "☑" : "☐"}
            </Text>
            <Text style={styles.text}>
              Hepatite: {patient.antecedents.hepatite ? "☑" : "☐"}
            </Text>
            <Text style={styles.text}>
              Hemorroides: {patient.antecedents.hemoroids ? "☑" : "☐"}
            </Text>
            <Text style={styles.text}>
              Asthme:{" "}
              {patient.antecedents.asthme? "☑" : "☐"}
            </Text>
            <Text style={styles.text}>
              Tuberculose:{" "}
              {patient.antecedents.tuberculose? "☑" : "☐"}
            </Text>
          </View>
        </View>
      </View>

      {/* Pied de page */}
      <View style={styles.footer}>
        <Text>Clinique Médicale Eniazou - Tous droits réservés © 2023</Text>
        <Text>Page 1 sur 1</Text>
      </View>
    </Page>
  </Document>
);
