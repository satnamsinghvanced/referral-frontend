import axios from "./axios";

export const fetchDashboardStats = async () => {
  const response = await axios.get("/dashboard");
  return response.data;
};