//import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logo from "@/images/logo.png"; // Assure-toi que le chemin est correct

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

// Type pour les données du paiement
type Payment = {
  id: number;
  patient: {
    numerofacture: string;
    uhid: string;
    nom: string;
    prenom: string;
    dateNaissance: string;
    sexe: string;
    telephone: string;
    adresse: string;
    date: string;
    heure: string;
    departement: string;
    doctor: string;
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
};

// Props pour le composant PaymentPDF
type PaymentPDFProps = {
  payment: Payment;
};

// Composant PaymentPDF
export const PaymentPDF = ({ payment }: PaymentPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* En-tête avec le logo et les informations de la clinique */}
      <View style={styles.header}>
        <Image src={logo} style={styles.logo} />
        <View style={styles.clinicInfo}>
          <Text>{payment.clinique.nom}</Text>
          <Text>{payment.clinique.adresse}</Text>
          <Text>Tél: {payment.clinique.telephone}</Text>
          <Text>Email: {payment.clinique.email}</Text>
        </View>
      </View>

      {/* Titre du document */}
      <View style={styles.section}>
        <Text style={styles.title}>Reçu de Paiement</Text>
      </View>

      {/* Informations du patient */}
      <View style={styles.section}>
        <Text style={styles.heading}>Informations du Patient</Text>
        <View style={styles.grid}>
          <View style={styles.column}>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Numéro de Facture:</Text>{" "}
              {payment.patient.numerofacture}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>UHID:</Text>{" "}
              {payment.patient.uhid}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Nom:</Text>{" "}
              {payment.patient.nom}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Prénom:</Text>{" "}
              {payment.patient.prenom}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Date de Naissance:</Text>{" "}
              {payment.patient.dateNaissance}
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Sexe:</Text>{" "}
              {payment.patient.sexe}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Téléphone:</Text>{" "}
              {payment.patient.telephone}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Adresse:</Text>{" "}
              {payment.patient.adresse}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Date:</Text>{" "}
              {payment.patient.date}
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Heure:</Text>{" "}
              {payment.patient.heure}
            </Text>
          </View>
        </View>
      </View>

      {/* Informations du département et du médecin */}
      <View style={styles.section}>
        <Text style={styles.heading}>Informations Médicales</Text>
        <View style={styles.grid}>
          <View style={styles.column}>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Département:</Text>{" "}
              {payment.patient.departement}
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Médecin:</Text>{" "}
              {payment.patient.doctor}
            </Text>
          </View>
        </View>
      </View>

      {/* Informations de paiement */}
      {payment.paiement && (
        <View style={styles.section}>
          <Text style={styles.heading}>Informations de Paiement</Text>
          <View style={styles.grid}>
            <View style={styles.column}>
              <Text style={styles.text}>
                <Text style={{ fontWeight: "bold" }}>Coût:</Text>{" "}
                {payment.paiement.cout} FCFA
              </Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.text}>
                <Text style={{ fontWeight: "bold" }}>Mode de Paiement:</Text>{" "}
                {payment.paiement.mode}
              </Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.text}>
                <Text style={{ fontWeight: "bold" }}>Statut:</Text>{" "}
                {payment.paiement.statut}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Pied de page */}
      <View style={styles.footer}>
        <Text>{payment.clinique.nom} - Tous droits réservés © 2023</Text>
        <Text>Page 1 sur 1</Text>
      </View>
    </Page>
  </Document>
);

export default PaymentPDF;
