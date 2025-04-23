import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logo from "@/images/logo.png";

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

type PatientPDFData = {
  id: number;
  uhid: string;
  queue: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  department: string;
  gender: string;
  doctor: string;
  fees: string;
  paymentMode: string;
  amount: number;
  transactionId?: string;
};

export const PaymentPDF = ({ patient }: { patient: PatientPDFData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Image src={logo} style={styles.logo} />
        <View style={styles.clinicInfo}>
          <Text>Clinique Médicale Eniazou</Text>
          <Text>Abidjan, Côte d'Ivoire</Text>
          <Text>Tél: +225 XX XX XX XX</Text>
          <Text>Email: contact@clinique.ci</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Facture de Consultation</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Informations du Patient</Text>
        <View style={styles.grid}>
          <View style={styles.column}>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Nom:</Text> {patient.name}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>UHID:</Text> {patient.uhid}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>File d'attente:</Text>{" "}
              {patient.queue}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Téléphone:</Text>{" "}
              {patient.phone}
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Date:</Text> {patient.date}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Heure:</Text> {patient.time}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Genre:</Text>{" "}
              {patient.gender}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Détails Médicaux</Text>
        <View style={styles.grid}>
          <View style={styles.column}>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Département:</Text>{" "}
              {patient.department}
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Médecin:</Text>{" "}
              {patient.doctor}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Détails de Paiement</Text>
        <View style={styles.grid}>
          <View style={styles.column}>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Montant:</Text>{" "}
              {patient.amount} FCFA
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Mode de Paiement:</Text>{" "}
              {patient.paymentMode}
            </Text>
          </View>
        </View>
        {patient.transactionId && (
          <Text style={styles.text}>
            <Text style={{ fontWeight: "bold" }}>ID Transaction:</Text>{" "}
            {patient.transactionId}
          </Text>
        )}
      </View>

      <View style={styles.footer}>
        <Text>Merci pour votre confiance</Text>
        <Text>Page 1 sur 1</Text>
      </View>
    </Page>
  </Document>
);
