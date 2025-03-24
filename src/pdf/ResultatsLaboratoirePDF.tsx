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
  table: {
    width: "100%",
    border: "1px solid #e0e0e0",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #e0e0e0",
  },
  tableHeader: {
    backgroundColor: "#018a8c",
    color: "#fff",
    fontWeight: "bold",
    padding: 8,
    textAlign: "center",
  },
  tableCell: {
    padding: 8,
    textAlign: "center",
    fontSize: 10,
    flex: 1,
  },
  abnormalValue: {
    color: "#ff0000",
    fontWeight: "bold",
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
});

type Analyse = {
  id: number;
  patient: string;
  type: string;
  dateDemande: string;
  dateResultat: string;
  statut: string;
  resultat: string;
  details?: {
    parametre: string;
    valeur: string;
    unite: string;
    reference: string;
    commentaire?: string;
  }[];
};

type ResultatsLaboratoirePDFProps = {
  analyse: Analyse;
};

export const ResultatsLaboratoirePDF = ({
  analyse,
}: ResultatsLaboratoirePDFProps) => {
  // Fonction pour vérifier si une valeur est hors de la plage de référence
  const isAbnormalValue = (valeur: string, reference: string) => {
    const [min, max] = reference.split(" - ").map(Number);
    const valeurNum = Number(valeur);
    return valeurNum < min || valeurNum > max;
  };

  return (
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
        <Text style={styles.title}>Résultats d'Analyse</Text>

        {/* Informations sur l'analyse */}
        <View style={styles.section}>
          <Text style={styles.heading}>Informations sur l'Analyse</Text>
          <View style={styles.grid}>
            <View style={styles.column}>
              <Text style={styles.text}>
                <Text style={{ fontWeight: "bold" }}>Patient:</Text>{" "}
                {analyse.patient}
              </Text>
              <Text style={styles.text}>
                <Text style={{ fontWeight: "bold" }}>Type d'analyse:</Text>{" "}
                {analyse.type}
              </Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.text}>
                <Text style={{ fontWeight: "bold" }}>Date de demande:</Text>{" "}
                {analyse.dateDemande}
              </Text>
              <Text style={styles.text}>
                <Text style={{ fontWeight: "bold" }}>Date de résultat:</Text>{" "}
                {analyse.dateResultat || "-"}
              </Text>
            </View>
          </View>
        </View>

        {/* Tableau des résultats détaillés */}
        {analyse.details && (
          <View style={styles.section}>
            <Text style={styles.heading}>Résultats Détaillés</Text>
            <View style={styles.table}>
              {/* En-tête du tableau */}
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={styles.tableCell}>Paramètre</Text>
                <Text style={styles.tableCell}>Valeur</Text>
                <Text style={styles.tableCell}>Unité</Text>
                <Text style={styles.tableCell}>Plage de Référence</Text>
                <Text style={styles.tableCell}>Commentaire</Text>
              </View>
              {/* Lignes du tableau */}
              {analyse.details.map((detail, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{detail.parametre}</Text>
                  <Text
                    style={[
                      styles.tableCell,
                      isAbnormalValue(detail.valeur, detail.reference)
                        ? styles.abnormalValue
                        : null,
                    ]}
                  >
                    {detail.valeur}
                  </Text>
                  <Text style={styles.tableCell}>{detail.unite}</Text>
                  <Text style={styles.tableCell}>{detail.reference}</Text>
                  <Text style={styles.tableCell}>
                    {detail.commentaire || "-"}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Commentaires et recommandations */}
        <View style={styles.section}>
          <Text style={styles.heading}>Commentaires</Text>
          <Text style={styles.text}>
            Les résultats indiquent que certains paramètres sont hors des plages
            de référence. Veuillez consulter un médecin pour une interprétation
            détaillée.
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
};
