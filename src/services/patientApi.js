import axiosInstance from "./axios";

export const fetchPatients = async ({ role, status, search, urgency, page = 1, limit = 10 }) => {
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

export const createPatient = async (patientData) => {
  const { data } = await axiosInstance.post("/patient/create", patientData);
  return data;
};


export const updatePatient = async (id, patientData) => {
  const { data } = await axiosInstance.put(`/patient/status?id=${id}`, patientData);
  return data;
};