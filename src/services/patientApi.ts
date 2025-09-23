import axiosInstance from "./axios";

interface FetchPatientsParams {
  role?: string;
  status?: string;
  search?: string;
  urgency?: string;
  page?: number;
  limit?: number;
}

export const fetchPatients = async ({ role, status, search, urgency, page = 1, limit = 10 }: FetchPatientsParams) => {
  const { data } = await axiosInstance.get("/patient/all", {
    params: {
      role,
      status,
      search,
      urgency,
      page,
      limit,
    },
  });
  return data;
};

export const createPatient = async (patientData: any) => {
  const { data } = await axiosInstance.post("/patient/create", patientData);
  return data;
};


export const updatePatient = async (id: string, patientData: any) => {
  const { data } = await axiosInstance.put(`/patient/status?id=${id}`, patientData);
  return data;
};