import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchReports, createReport, updateReport } from "../services/reports";
import { GenerateReportPayload } from "../types/reports";
import { addToast } from "@heroui/react";
import { queryClient } from "../providers/QueryProvider";

export const useReports = (params: any) => {
  return useQuery({
    queryKey: ["reports", params],
    queryFn: () => fetchReports(params),
  });
};

export const useGenerateReport = () => {
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

export const useUpdateReport = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      updateReport(id, payload),
    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Report updated successfully.",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update report.",
        color: "danger",
      });
    },
  });
};
