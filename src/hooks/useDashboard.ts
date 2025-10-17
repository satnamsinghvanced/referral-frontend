import { useQuery } from "@tanstack/react-query";
import { fetchDashboardStats } from "../services/dashboard";

export const useDashboardStats = () => {
  const queryResult = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardStats,
  });

  return queryResult;
};
