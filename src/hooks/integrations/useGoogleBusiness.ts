import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../providers/QueryProvider";
import {
  deleteGoogleBusinessIntegration,
  getGoogleBusinessAuthUrl,
  getGoogleBusinessIntegration,
  updateGoogleBusinessIntegration,
} from "../../services/integrations/googleBusiness";

export const BUSINESS_KEYS = {
  all: ["business-integration"] as const,
  details: () => [...BUSINESS_KEYS.all, "current"] as const,
};

export const useBusinessIntegration = () => {
  return useQuery({
    queryKey: BUSINESS_KEYS.details(),
    queryFn: getGoogleBusinessIntegration,
  });
};

export const useConnectBusiness = () => {
  return useMutation({
    mutationFn: getGoogleBusinessAuthUrl,
    onSuccess: (data) => {
      if (data.authUrl) {
        window.open(data.authUrl, "_blank");
      }
    },
  });
};

export const useUpdateBusiness = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      updateGoogleBusinessIntegration(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUSINESS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
};

export const useDisconnectBusiness = () => {
  return useMutation({
    mutationFn: deleteGoogleBusinessIntegration,
    onSuccess: () => {
      queryClient.setQueryData(BUSINESS_KEYS.details(), null);
      queryClient.invalidateQueries({ queryKey: BUSINESS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
};
