import axios from "./axios";

export interface PatientData {
  name: string;
  age: number;
  email: string;
}

export const fetchReferral = async (params?: {
  role?: string;
  status?: string;
  search?: string;
  urgency?: string;
  locations?: string[];
  page?: number;
  limit?: number;
}) => {
  const { data } = await axios.get("/referral", { params });
  return data;
};
export const fetchReferrer = async (params?: {
  role?: string;
  status?: string;
  search?: string;
  filter?: string;
  urgency?: string;
  locations?: string[];
  page?: number;
  limit?: number;
}) => {
  const { data } = await axios.get("/referrers", { params });
  return data;
};

const userId = localStorage.getItem('user_id')
export const createPatient = async (patientData: PatientData, type: string) => {
  const { data } = await axios.post(`/referrers/${userId}?type=${type}`, patientData);
  console.log('createPatient data: ', data);
  return data;
};


export const updatePatient = async (id: string, patientData: PatientData) => {
  const { data } = await axios.put(`/patients/${id}`, patientData);
  return data;
};
