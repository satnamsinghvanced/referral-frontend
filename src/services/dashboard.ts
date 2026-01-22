import { DashboardData, SearchParams, SearchResult } from "../types/dashboard";
import axios from "./axios";

export const fetchDashboardStats = async () => {
  const response = await axios.get("/dashboard/stats");
  return response.data;
};

export const fetchDashboardData = async (): Promise<DashboardData> => {
  const response = await axios.get(`/dashboard`);
  return response.data;
};

export const globalSearch = async (
  params: SearchParams,
): Promise<SearchResult[]> => {
  // Pass an empty object as the body to prevent axios from sending 'null'
  const response = await axios.post(
    "/dashboard/search",
    {},
    {
      params: params,
    },
  );
  return response.data;
};
