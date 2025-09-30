import axios from "./axios";

export interface PatientData {
  name: string;
  age: number;
  email: string;
}

export const fetchPatients = async (params?: {
  role?: string;
  status?: string;
  search?: string;
  urgency?: string;
  locations?: string[];
  page?: number;
  limit?: number;
}) => {
  const { data } = await axios.get("/patients", { params });
  return data;
};

export const createPatient = async (patientData: PatientData) => {
  const { data } = await axios.post("/patients", patientData);
  return data;
};

export const updatePatient = async (id: string, patientData: PatientData) => {
  const { data } = await axios.put(`/patients/${id}`, patientData);
  return data;
};
