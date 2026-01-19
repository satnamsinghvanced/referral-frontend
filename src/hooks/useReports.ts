import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchReports, createReport } from "../services/reports";
import { GenerateReportPayload } from "../types/reports";
import { addToast } from "@heroui/react";

export const useReports = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["reports", page, limit],
    queryFn: () => fetchReports(page, limit),
  });
};

export const useGenerateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: GenerateReportPayload) => createReport(payload),
    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Report generation started successfully.",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to generate report.",
        color: "danger",
      });
    },
  });
};
