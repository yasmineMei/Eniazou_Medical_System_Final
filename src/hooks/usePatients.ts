import { useState } from "react";
import { Patient } from "@/types/patient";
import { patientsData } from "@/data/patients";

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>(patientsData);

  const getPatient = (id: string) => {
    return patients.find((patient) => patient.id === id);
  };

  const updatePatient = (updatedPatient: Patient) => {
    setPatients((prev) =>
      prev.map((patient) =>
        patient.id === updatedPatient.id ? updatedPatient : patient
      )
    );
  };

  const deletePatient = (id: string) => {
    setPatients((prev) => prev.filter((patient) => patient.id !== id));
  };

  return {
    patients,
    getPatient,
    updatePatient,
    deletePatient,
  };
}
