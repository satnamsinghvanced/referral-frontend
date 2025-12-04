import { useQuery } from "@tanstack/react-query";
import { fetchDashboardStats, fetchDashboardData } from "../services/dashboard";

export const useDashboardStats = () => {
  const queryResult = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: fetchDashboardStats,
  });
  return queryResult;
};

export const useDashboard = (id: string) => {
  return useQuery({
    queryKey: ["dashboard", id],
    queryFn: () => fetchDashboardData(id),
    enabled: !!id,
  });
};
