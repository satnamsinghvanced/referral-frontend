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

