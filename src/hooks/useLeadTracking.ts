import { addToast } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../providers/QueryProvider";
import {
  addLead,
  getLeadStats,
  getLeadStatus,
  updateLead,
} from "../services/leadTracking";

export const useLeadStatus = (params?: any) => {
  return useQuery({
    queryKey: ["leadStatus", params],
    queryFn: () => getLeadStatus(params),
  });
};

export const useLeadStats = () => {
  return useQuery({
    queryKey: ["leadStats"],
    queryFn: getLeadStats,
  });
};

export const useAddLead = () => {
  return useMutation({
    mutationFn: addLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadStatus"] });
      queryClient.invalidateQueries({ queryKey: ["leadStats"] });
      addToast({
        title: "Success",
        description: "Lead added successfully",
        color: "success",
      });
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to add lead",
        color: "danger",
      });
    },
  });
};

export const useUpdateLead = () => {
  return useMutation({
    mutationFn: updateLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadStatus"] });
      queryClient.invalidateQueries({ queryKey: ["leadStats"] });
      addToast({
        title: "Success",
        description: "Lead updated successfully",
        color: "success",
      });
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update lead",
        color: "danger",
      });
    },
  });
};
