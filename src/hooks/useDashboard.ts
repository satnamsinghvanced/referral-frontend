import { addToast } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  fetchDashboardData,
  fetchDashboardStats,
  globalSearch,
} from "../services/dashboard";
import { SearchParams } from "../types/dashboard";

export const useDashboardStats = (params?: { locationId?: string | undefined }) => {
  const queryResult = useQuery({
    queryKey: ["dashboardStats", params?.locationId],
    queryFn: () => fetchDashboardStats(params),
  });
  return queryResult;
};

export const useDashboard = (params?: { locationId?: string | undefined }) => {
  return useQuery({
    queryKey: ["dashboard", params?.locationId],
    queryFn: () => fetchDashboardData(params),
  });
};

export const SEARCH_QUERY_KEY = (q: string) => ["global-search", q];

export const useGlobalSearch = (params: SearchParams) => {
  return useQuery({
    queryKey: SEARCH_QUERY_KEY(params.q),
    queryFn: () => globalSearch(params),
    enabled: !!params.q && params.q.length >= 2,
    retry: false,
    meta: {
      onError: (error: AxiosError) => {
        const errorMessage =
          (error.response?.data as { message?: string })?.message ||
          "An error occurred while searching.";
        addToast({
          title: "Search Error",
          description: errorMessage,
          color: "danger",
        });
      },
    },
  });
};
