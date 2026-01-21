import { addToast } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  fetchDashboardData,
  fetchDashboardStats,
  globalSearch,
} from "../services/dashboard";
import { SearchParams } from "../types/dashboard";

export const useDashboardStats = () => {
  const queryResult = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: fetchDashboardStats,
  });
  return queryResult;
};

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData,
  });
};

export const SEARCH_QUERY_KEY = (q: string) => ["global-search", q];

export const useGlobalSearch = (params: SearchParams) => {
  return useQuery({
    queryKey: SEARCH_QUERY_KEY(params.q),
    queryFn: () => globalSearch(params),
    enabled: !!params.q && params.q.length >= 2, // Only search if query has 2+ chars
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
