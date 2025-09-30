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
  const { data } = await axios.get("/patient", { params });
  return data;
};

const userId = '68da331a02f71ff8ff945bcc'
export const createPatient = async (patientData: PatientData) => {
  const { data } = await axios.post(`/patient/${userId}`, patientData);
  console.log('createPatient data: ', data)
  return data;
};

export const updatePatient = async (id: string, patientData: PatientData) => {
  const { data } = await axios.put(`/patients/${id}`, patientData);
  return data;
};
