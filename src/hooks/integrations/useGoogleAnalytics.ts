import { addToast } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../providers/QueryProvider";
import {
  createGoogleAnalyticsIntegration,
  fetchGoogleAnalyticsIntegration,
  updateGoogleAnalyticsIntegration,
} from "../../services/integrations/googleAnalytics";
import {
  GoogleAnalyticsIntegration,
  UpdateGoogleAnalyticsRequest,
} from "../../types/integrations/googleAnalytics";

export const GOOGLE_ANALYTICS_KEYS = {
  all: ["googleAnalytics"] as const,
  integration: () => [...GOOGLE_ANALYTICS_KEYS.all, "integration"] as const,
};

export const useFetchGoogleAnalyticsIntegration = () => {
  return useQuery<GoogleAnalyticsIntegration, Error>({
    queryKey: GOOGLE_ANALYTICS_KEYS.integration(),
    queryFn: fetchGoogleAnalyticsIntegration,
  });
};

export const useUpdateGoogleAnalyticsIntegration = () => {
  return useMutation<
    GoogleAnalyticsIntegration,
    any,
    { id: string; data: UpdateGoogleAnalyticsRequest }
  >({
    mutationFn: ({ id, data }) => updateGoogleAnalyticsIntegration(id, data),

    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Google Analytics integration updated successfully",
        color: "success",
      });

      queryClient.invalidateQueries({
        queryKey: GOOGLE_ANALYTICS_KEYS.all,
      });
    },

    onError: (error) => {
      const errorMessage =
        (error?.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to update Google Analytics integration";

      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });
};

export const useCreateGoogleAnalyticsIntegration = () => {
  return useMutation<
    GoogleAnalyticsIntegration,
    any,
    Partial<GoogleAnalyticsIntegration>
  >({
    mutationFn: (data) => createGoogleAnalyticsIntegration(data),

    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Google Analytics integration created successfully",
        color: "success",
      });

      queryClient.invalidateQueries({
        queryKey: GOOGLE_ANALYTICS_KEYS.all,
      });
    },

    onError: (error) => {
      const errorMessage =
        (error?.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to create Google Analytics integration";

      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });
};
