import { useMutation, useQuery } from "@tanstack/react-query";
import {
  GenerateAuthUrlRequest,
  GenerateAuthUrlResponse,
} from "../../types/integrations/googleCalendar";
import {
  fetchGoogleAdsIntegration,
  fetchMetaAdsIntegration,
  generateGoogleAdsAuthUrl,
  generateMetaAdsAuthUrl,
  updateGoogleAdsIntegration,
  updateMetaAdsIntegration,
} from "../../services/integrations/ads";
import { addToast } from "@heroui/react";
import { queryClient } from "../../providers/QueryProvider";

export const GOOGLE_ADS_KEYS = {
  all: ["googleAds"] as const,
  integration: () => [...GOOGLE_ADS_KEYS.all, "integration"] as const,
};

export const useGenerateGoogleAdsAuthUrl = () => {
  return useMutation<GenerateAuthUrlResponse, any, GenerateAuthUrlRequest>({
    mutationFn: (data) => generateGoogleAdsAuthUrl(data),

    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Google ads connected successfully",
        color: "success",
      });

      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },

    onError: (error) => {
      const errorMessage =
        (error?.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to connect Google ads";

      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });
};

export const useFetchGoogleAdsIntegration = () => {
  return useQuery<any, Error>({
    queryKey: GOOGLE_ADS_KEYS.integration(),
    queryFn: fetchGoogleAdsIntegration,
  });
};

export const useUpdateGoogleAdsIntegration = () => {
  return useMutation<any, any, { id: string; data: any }>({
    mutationFn: ({ id, data }) => updateGoogleAdsIntegration(id, data),

    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Google Ads integration updated successfully",
        color: "success",
      });

      queryClient.invalidateQueries({
        queryKey: GOOGLE_ADS_KEYS.integration(),
      });

      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },

    onError: (error) => {
      const errorMessage =
        (error?.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to update Google Ads integration";

      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });
};

// META
export const META_ADS_KEYS = {
  all: ["metaAds"] as const,
  integration: () => [...META_ADS_KEYS.all, "integration"] as const,
};

export const useGenerateMetaAdsAuthUrl = () => {
  return useMutation<GenerateAuthUrlResponse, any, GenerateAuthUrlRequest>({
    mutationFn: (data) => generateMetaAdsAuthUrl(data),

    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Meta ads connected successfully",
        color: "success",
      });

      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },

    onError: (error) => {
      const errorMessage =
        (error?.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to connect Meta ads";

      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });
};

export const useFetchMetaAdsIntegration = () => {
  return useQuery<any, Error>({
    queryKey: META_ADS_KEYS.integration(),
    queryFn: fetchMetaAdsIntegration,
  });
};

export const useUpdateMetaAdsIntegration = () => {
  return useMutation<any, any, { id: string; data: any }>({
    mutationFn: ({ id, data }) => updateMetaAdsIntegration(id, data),

    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Meta ads integration updated successfully",
        color: "success",
      });

      queryClient.invalidateQueries({
        queryKey: META_ADS_KEYS.integration(),
      });

      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },

    onError: (error) => {
      const errorMessage =
        (error?.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to update Meta ads integration";

      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });
};
