import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../providers/QueryProvider";
import {
  deleteGoogleAnalyticsIntegration,
  getGoogleAnalyticsAuthUrl,
  getGoogleAnalyticsIntegration,
  updateGoogleAnalyticsIntegration,
  getGoogleAnalyticsProperties,
  syncGoogleAnalyticsProperties,
  connectGoogleAnalyticsProperty,
} from "../../services/integrations/googleAnalytics";

export const ANALYTICS_KEYS = {
  all: ["analytics-integration"] as const,
  details: () => [...ANALYTICS_KEYS.all, "current"] as const,
  properties: () => [...ANALYTICS_KEYS.all, "properties"] as const,
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

      queryClient.invalidateQueries({ queryKey: ["analytics", "google-ads"] });
    },
  });
};

export const useDisconnectAnalytics = () => {
  return useMutation({
    mutationFn: deleteGoogleAnalyticsIntegration,
    onSuccess: () => {
      queryClient.setQueryData(ANALYTICS_KEYS.details(), null);
      queryClient.invalidateQueries({ queryKey: ANALYTICS_KEYS.all });

      queryClient.invalidateQueries({ queryKey: ["analytics", "google-ads"] });
    },
  });
};

export const useAnalyticsProperties = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.properties(),
    queryFn: getGoogleAnalyticsProperties,
    enabled,
  });
};

export const useSyncAnalyticsProperties = () => {
  return useMutation({
    mutationFn: syncGoogleAnalyticsProperties,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ANALYTICS_KEYS.properties() });
      queryClient.invalidateQueries({ queryKey: ANALYTICS_KEYS.details() });

      queryClient.invalidateQueries({ queryKey: ["analytics", "google-ads"] });
    },
  });
};

export const useConnectAnalyticsProperty = () => {
  return useMutation({
    mutationFn: connectGoogleAnalyticsProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ANALYTICS_KEYS.all });

      queryClient.invalidateQueries({ queryKey: ["analytics", "google-ads"] });
    },
  });
};
