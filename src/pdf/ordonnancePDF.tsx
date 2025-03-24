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
  table: {
    width: "100%",
    border: "1px solid #e0e0e0",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #e0e0e0",
  },
  tableCell: {
    padding: 8,
    textAlign: "left",
    fontSize: 10,
    flex: 1,
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

type Medicament = {
  nom: string;
  posologie: string;
};

type Ordonnance = {
  patient: string;
  date: string;
  medicaments: Medicament[];
  instructions: string;
};

type OrdonnancePDFProps = {
  ordonnance: Ordonnance;
};

export const OrdonnancePDF = ({ ordonnance }: OrdonnancePDFProps) => (
  <Document>
    <Page style={styles.page}>
      {/* En-tête avec le logo et les informations de la clinique */}
      <View style={styles.header}>
        <Image src={logo} style={styles.logo} />
        <View style={styles.clinicInfo}>
          <Text>Clinique Médicale Eniazou</Text>
          <Text>123 Rue de la Santé, Abidjan, Côte d'Ivoire</Text>
          <Text>Tél: +225 01 23 45 67 89</Text>
          <Text>Email: contact@eniazou.com</Text>
        </View>
      </View>

      {/* Titre du document */}
      <Text style={styles.title}>Ordonnance Médicale</Text>

      {/* Informations sur l'ordonnance */}
      <View style={styles.section}>
        <Text style={styles.heading}>Informations sur l'Ordonnance</Text>
        <View style={styles.grid}>
          <Text style={styles.text}>
            <Text style={{ fontWeight: "bold" }}>Patient:</Text>{" "}
            {ordonnance.patient}
          </Text>
          <Text style={styles.text}>
            <Text style={{ fontWeight: "bold" }}>Date:</Text> {ordonnance.date}
          </Text>
        </View>
      </View>

      {/* Liste des médicaments */}
      <View style={styles.section}>
        <Text style={styles.heading}>Médicaments Prescrits</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, { backgroundColor: "#018a8c" }]}>
            <Text
              style={[styles.tableCell, { color: "#fff", fontWeight: "bold" }]}
            >
              Médicament
            </Text>
            <Text
              style={[styles.tableCell, { color: "#fff", fontWeight: "bold" }]}
            >
              Posologie
            </Text>
          </View>
          {ordonnance.medicaments.map((medicament, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{medicament.nom}</Text>
              <Text style={styles.tableCell}>{medicament.posologie}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Instructions supplémentaires */}
      <View style={styles.section}>
        <Text style={styles.heading}>Instructions</Text>
        <Text style={styles.text}>{ordonnance.instructions}</Text>
      </View>

      {/* Pied de page */}
      <View style={styles.footer}>
        <Text>Clinique Médicale Eniazou - Tous droits réservés © 2023</Text>
        <Text>Page 1 sur 1</Text>
      </View>
    </Page>
  </Document>
);
