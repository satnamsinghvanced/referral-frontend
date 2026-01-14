import { useQuery } from "@tanstack/react-query";
import {
  fetchGeneralAnalytics,
  fetchGoogleAdsIntegration,
  fetchGoogleAnalytics,
  fetchMetaAdsIntegration,
} from "../services/analytics";

export const useGeneralAnalytics = () => {
  return useQuery({
    queryKey: ["analytics", "general"],
    queryFn: fetchGeneralAnalytics,
  });
};

export const useGoogleAnalytics = () => {
  return useQuery({
    queryKey: ["analytics", "google-site"],
    queryFn: fetchGoogleAnalytics,
  });
};

export const useGoogleAds = () => {
  return useQuery({
    queryKey: ["analytics", "google-ads"],
    queryFn: fetchGoogleAdsIntegration,
  });
};

export const useMetaAds = () => {
  return useQuery({
    queryKey: ["analytics", "meta-ads"],
    queryFn: fetchMetaAdsIntegration,
  });
};
