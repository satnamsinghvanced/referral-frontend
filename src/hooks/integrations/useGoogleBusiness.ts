import { addToast } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../providers/QueryProvider";
import {
  fetchGoogleBusinessIntegration,
  generateGoogleBusinessAuthUrl,
  updateGoogleBusinessIntegration,
} from "../../services/integrations/googleBusiness";
import {
  GenerateAuthUrlRequest,
  GenerateAuthUrlResponse,
} from "../../types/integrations/googleCalendar";

export const GOOGLE_BUSINESS_KEYS = {
  all: ["googleBusiness"] as const,
  integration: () => [...GOOGLE_BUSINESS_KEYS.all, "integration"] as const,
};

export const useGenerateGoogleBusinessAuthUrl = () => {
  return useMutation<GenerateAuthUrlResponse, any, GenerateAuthUrlRequest>({
    mutationFn: (data) => generateGoogleBusinessAuthUrl(data),

    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Google Business connected successfully",
        color: "success",
      });

      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },

    onError: (error) => {
      const errorMessage =
        (error?.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to connect Google Business";

      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });
};

export const useFetchGoogleBusinessIntegration = () => {
  return useQuery<any, Error>({
    queryKey: GOOGLE_BUSINESS_KEYS.integration(),
    queryFn: fetchGoogleBusinessIntegration,
  });
};

export const useUpdateGoogleBusinessIntegration = () => {
  return useMutation<any, any, { id: string; data: any }>({
    mutationFn: ({ id, data }) => updateGoogleBusinessIntegration(id, data),

    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Google Business integration updated successfully",
        color: "success",
      });

      queryClient.invalidateQueries({
        queryKey: GOOGLE_BUSINESS_KEYS.integration(),
      });

      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },

    onError: (error) => {
      const errorMessage =
        (error?.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to update Google Business integration";

      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });
};
