import { DashboardData } from "../types/dashboard";
import axios from "./axios";

export const fetchDashboardStats = async () => {
  const response = await axios.get("/dashboard/stats");
  return response.data;
};

export const fetchDashboardData = async (): Promise<DashboardData> => {
  const response = await axios.get(`/dashboard`);
  return response.data;
};
