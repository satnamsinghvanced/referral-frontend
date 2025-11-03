import axios from "./axios";

export const fetchDashboardStats = async () => {
  const response = await axios.get("/dashboard/stats");
  return response.data;
};

export const fetchDashboardData = async (id: string) => {
  const response = await axios.get(`/dashboard/${id}`);
  return response.data;
};
