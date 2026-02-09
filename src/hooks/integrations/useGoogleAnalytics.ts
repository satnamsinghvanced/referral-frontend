import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../providers/QueryProvider";
import {
  deleteGoogleAnalyticsIntegration,
  getGoogleAnalyticsAuthUrl,
  getGoogleAnalyticsIntegration,
  updateGoogleAnalyticsIntegration,
} from "../../services/integrations/googleAnalytics";

export const ANALYTICS_KEYS = {
  all: ["analytics-integration"] as const,
  details: () => [...ANALYTICS_KEYS.all, "current"] as const,
};

export const useAnalyticsIntegration = () => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.details(),
    queryFn: getGoogleAnalyticsIntegration,
  });
};

export const useConnectAnalytics = () => {
  return useMutation({
    mutationFn: getGoogleAnalyticsAuthUrl,
    onSuccess: (data) => {
      if (data.authUrl) {
        window.open(data.authUrl, "_blank");
      }
    },
  });
};

export const useUpdateAnalytics = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      updateGoogleAnalyticsIntegration(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ANALYTICS_KEYS.all });
    },
  });
};

export const useDisconnectAnalytics = () => {
  return useMutation({
    mutationFn: deleteGoogleAnalyticsIntegration,
    onSuccess: () => {
      queryClient.setQueryData(ANALYTICS_KEYS.details(), null);
      queryClient.invalidateQueries({ queryKey: ANALYTICS_KEYS.all });
    },
  });
};
