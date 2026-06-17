import { addToast } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../providers/QueryProvider";
import {
  getLeadAutomations,
  createLeadAutomation,
  updateLeadAutomation,
  deleteLeadAutomation,
  toggleLeadAutomation,
} from "../services/leadAutomation";

export const useLeadAutomations = () => {
  return useQuery({
    queryKey: ["leadAutomations"],
    queryFn: getLeadAutomations,
  });
};

export const useCreateLeadAutomation = () => {
  return useMutation({
    mutationFn: createLeadAutomation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadAutomations"] });
      addToast({
        title: "Success",
        description: "Lead automation created successfully",
        color: "success",
      });
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to create automation",
        color: "danger",
      });
    },
  });
};

export const useUpdateLeadAutomation = () => {
  return useMutation({
    mutationFn: updateLeadAutomation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadAutomations"] });
      addToast({
        title: "Success",
        description: "Lead automation updated successfully",
        color: "success",
      });
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update automation",
        color: "danger",
      });
    },
  });
};

export const useDeleteLeadAutomation = () => {
  return useMutation({
    mutationFn: deleteLeadAutomation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadAutomations"] });
      addToast({
        title: "Success",
        description: "Lead automation deleted successfully",
        color: "success",
      });
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to delete automation",
        color: "danger",
      });
    },
  });
};

export const useToggleLeadAutomation = () => {
  return useMutation({
    mutationFn: toggleLeadAutomation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadAutomations"] });
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to toggle automation",
        color: "danger",
      });
    },
  });
};
