import { useMutation, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { queryClient } from "../../providers/QueryProvider";
import {
  connectGoogleAdsAccount,
  connectMetaAdsAccount,
  deleteGoogleAdsIntegration,
  deleteMetaAdsIntegration,
  getGoogleAdsAccounts,
  getMetaAdsAccounts,
  getGoogleAdsAuthUrl,
  getGoogleAdsIntegration,
  getMetaAdsAuthUrl,
  getMetaAdsIntegration,
  syncGoogleAdsAccounts,
  syncMetaAdsAccounts,
  updateGoogleAdsIntegration,
  updateMetaAdsIntegration,
} from "../../services/integrations/ads";

export const GOOGLE_ADS_KEYS = {
  all: ["google-ads-integration"] as const,
  details: () => [...GOOGLE_ADS_KEYS.all, "current"] as const,
};

export const META_ADS_KEYS = {
  all: ["meta-ads-integration"] as const,
  details: () => [...META_ADS_KEYS.all, "current"] as const,
};

// --- Google Ads ---

export const useGoogleAdsIntegration = () => {
  return useQuery({
    queryKey: GOOGLE_ADS_KEYS.details(),
    queryFn: getGoogleAdsIntegration,
  });
};

export const useConnectGoogleAds = () => {
  return useMutation({
    mutationFn: getGoogleAdsAuthUrl,
    onSuccess: (data) => {
      if (data.authUrl) {
        window.open(data.authUrl, "_blank");
      }
    },
  });
};

export const useUpdateGoogleAds = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      updateGoogleAdsIntegration(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOOGLE_ADS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });

      queryClient.invalidateQueries({ queryKey: ["analytics", "google-ads"] });
    },
  });
};

export const useDisconnectGoogleAds = () => {
  return useMutation({
    mutationFn: deleteGoogleAdsIntegration,
    onSuccess: () => {
      queryClient.setQueryData(GOOGLE_ADS_KEYS.details(), null);
      queryClient.invalidateQueries({ queryKey: GOOGLE_ADS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });

      queryClient.invalidateQueries({ queryKey: ["analytics", "google-ads"] });
    },
  });
};

// --- Meta Ads ---

export const useMetaAdsIntegration = () => {
  return useQuery({
    queryKey: META_ADS_KEYS.details(),
    queryFn: getMetaAdsIntegration,
  });
};

export const useConnectMetaAds = () => {
  return useMutation({
    mutationFn: getMetaAdsAuthUrl,
    onSuccess: (data) => {
      if (data.authUrl) {
        window.open(data.authUrl, "_blank");
      }
    },
  });
};

export const useUpdateMetaAds = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      updateMetaAdsIntegration(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: META_ADS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      queryClient.invalidateQueries({ queryKey: ["analytics", "meta-ads"] });
    },
  });
};

export const useDisconnectMetaAds = () => {
  return useMutation({
    mutationFn: deleteMetaAdsIntegration,
    onSuccess: () => {
      queryClient.setQueryData(META_ADS_KEYS.details(), null);
      queryClient.invalidateQueries({ queryKey: META_ADS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      queryClient.invalidateQueries({ queryKey: ["analytics", "meta-ads"] });
    },
  });
};

export const useGoogleAdsAccounts = (enabled: boolean = true) => {
  return useQuery({
    queryKey: [...GOOGLE_ADS_KEYS.all, "accounts"],
    queryFn: getGoogleAdsAccounts,
    enabled,
  });
};

export const useSyncGoogleAdsAccounts = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  return useMutation({
    mutationFn: () => syncGoogleAdsAccounts(token || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOOGLE_ADS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["analytics", "google-ads"] });
    },
  });
};

export const useConnectGoogleAdsAccount = () => {
  return useMutation({
    mutationFn: connectGoogleAdsAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOOGLE_ADS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });

      queryClient.invalidateQueries({ queryKey: ["analytics", "google-ads"] });
    },
  });
};

// --- Meta Ads Account Management ---

export const useMetaAdsAccounts = (enabled: boolean = true) => {
  return useQuery({
    queryKey: [...META_ADS_KEYS.all, "accounts"],
    queryFn: getMetaAdsAccounts,
    enabled,
  });
};

export const useSyncMetaAdsAccounts = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  return useMutation({
    mutationFn: () => syncMetaAdsAccounts(token || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: META_ADS_KEYS.all });

      queryClient.invalidateQueries({ queryKey: ["analytics", "meta-ads"] });
    },
  });
};

export const useConnectMetaAdsAccount = () => {
  return useMutation({
    mutationFn: connectMetaAdsAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: META_ADS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });

      queryClient.invalidateQueries({ queryKey: ["analytics", "meta-ads"] });
    },
  });
};
