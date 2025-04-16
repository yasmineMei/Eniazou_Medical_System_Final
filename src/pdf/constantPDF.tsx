import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import logo from "@/images/logo.png";

// Charger les polices si nécessaire
Font.register({
  family: "Helvetica",
  fonts: [
    { src: "https://fonts.gstatic.com/s/helvetica/v15/4UaBrE5sJBJ1-6-HA.woff" }, // Regular
    {
      src: "https://fonts.gstatic.com/s/helvetica/v15/4UaGrE5sJBJ1-6-HA.woff",
      fontWeight: 700,
    }, // Bold
  ],
});

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
  patientInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  vitalSignsContainer: {
    marginTop: 20,
  },
  vitalSignRow: {
    flexDirection: "row",
    borderBottom: "1px solid #e0e0e0",
    paddingVertical: 8,
  },
  vitalSignLabel: {
    width: "40%",
    fontSize: 12,
    fontWeight: "bold",
  },
  vitalSignValue: {
    width: "30%",
    fontSize: 12,
  },
  vitalSignReference: {
    width: "30%",
    fontSize: 12,
    color: "#666",
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
  signature: {
    marginTop: 40,
    paddingTop: 20,
    borderTop: "1px solid #e0e0e0",
  },
});

type VitalSigns = {
  temperature: string;
  bloodPressure: string;
  pulse: string;
  oxygen: string;
  glucose: string;
};

type ClinicInfo = {
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
};

type PatientInfo = {
  id: string;
  name: string;
  room: string;
  age: number;
};

type ConstantPDFProps = {
  clinic: ClinicInfo;
  patient: PatientInfo;
  vitals: VitalSigns;
  date: string;
};

export const ConstantPDF = ({
  clinic,
  patient,
  vitals,
  date,
}: ConstantPDFProps) => {
  const getReferenceRange = (key: keyof VitalSigns) => {
    const ranges = {
      temperature: "36.5 - 37.5 °C",
      bloodPressure: "120/80 mmHg",
      pulse: "60-100 bpm",
      oxygen: "95-100 %",
      glucose: "70-110 mg/dL",
    };
    return ranges[key];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête avec le logo et les informations de la clinique */}
        <View style={styles.header}>
          <Image src={logo} style={styles.logo} />
          <View style={styles.clinicInfo}>
            <Text>{clinic.nom}</Text>
            <Text>{clinic.adresse}</Text>
            <Text>Tél: {clinic.telephone}</Text>
            <Text>Email: {clinic.email}</Text>
          </View>
        </View>

        {/* Titre du document */}
        <View style={styles.section}>
          <Text style={styles.title}>Fiche des Constantes Vitales</Text>
        </View>

        {/* Informations patient */}
        <View style={styles.section}>
          <View style={styles.patientInfo}>
            <View>
              <Text style={styles.text}>
                <Text style={{ fontWeight: "bold" }}>Patient: </Text>
                {patient.name}
              </Text>
              <Text style={styles.text}>
                <Text style={{ fontWeight: "bold" }}>ID: </Text>
                {patient.id}
              </Text>
            </View>
            <View>
              <Text style={styles.text}>
                <Text style={{ fontWeight: "bold" }}>Chambre: </Text>
                {patient.room}
              </Text>
              <Text style={styles.text}>
                <Text style={{ fontWeight: "bold" }}>Âge: </Text>
                {patient.age} ans
              </Text>
            </View>
          </View>
          <Text style={styles.text}>
            <Text style={{ fontWeight: "bold" }}>Date: </Text>
            {formatDate(date)}
          </Text>
        </View>

        {/* Constantes vitales */}
        <View style={styles.vitalSignsContainer}>
          <View
            style={{
              ...styles.vitalSignRow,
              backgroundColor: "#018a8c",
              color: "white",
            }}
          >
            <Text style={{ ...styles.vitalSignLabel, color: "white" }}>
              Paramètre
            </Text>
            <Text style={{ ...styles.vitalSignValue, color: "white" }}>
              Valeur
            </Text>
            <Text style={{ ...styles.vitalSignReference, color: "white" }}>
              Valeurs de référence
            </Text>
          </View>

          {Object.entries(vitals).map(([key, value]) => (
            <View key={key} style={styles.vitalSignRow}>
              <Text style={styles.vitalSignLabel}>
                {key === "temperature" && "Température"}
                {key === "bloodPressure" && "Pression artérielle"}
                {key === "pulse" && "Pouls"}
                {key === "oxygen" && "SpO2"}
                {key === "glucose" && "Glycémie"}
              </Text>
              <Text style={styles.vitalSignValue}>
                {value}
                {key === "temperature" && " °C"}
                {key === "pulse" && " bpm"}
                {key === "oxygen" && " %"}
                {key === "glucose" && " mg/dL"}
              </Text>
              <Text style={styles.vitalSignReference}>
                {getReferenceRange(key as keyof VitalSigns)}
              </Text>
            </View>
          ))}
        </View>

        {/* Signature */}
        <View style={styles.signature}>
          <Text style={{ fontSize: 12, marginTop: 30 }}>
            Signature de l'infirmier(e): ____________________________________
          </Text>
        </View>

        {/* Pied de page */}
        <View style={styles.footer}>
          <Text>
            {clinic.nom} - Tous droits réservés © {new Date().getFullYear()}
          </Text>
          <Text>Page 1 sur 1</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ConstantPDF;
