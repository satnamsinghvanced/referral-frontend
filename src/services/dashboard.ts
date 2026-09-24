import { DashboardData, SearchParams, SearchResult } from "../types/dashboard";
import axios from "./axios";

export const fetchDashboardStats = async (params?: { locationId?: string | undefined }) => {
  const response = await axios.get("/dashboard/stats", { params });
  return response.data;
};

export const fetchDashboardData = async (params?: { locationId?: string | undefined }): Promise<DashboardData> => {
  const response = await axios.get(`/dashboard`, { params });
  return response.data;
};

export const globalSearch = async (
  params: SearchParams,
): Promise<SearchResult[]> => {
  const response = await axios.post(
    "/dashboard/search",
    {},
    {
      params: params,
    },
  );
  return response.data;
};
