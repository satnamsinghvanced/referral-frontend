import { useMutation, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { queryClient } from "../../providers/QueryProvider";
import {
  connectGoogleBusinessLocation,
  deleteGoogleBusinessIntegration,
  getGoogleBusinessAuthUrl,
  getGoogleBusinessIntegration,
  getGoogleBusinessLocations,
  saveWindsorCredentials,
  SaveWindsorCredentialsPayload,
  syncGoogleBusinessProfiles,
  updateGoogleBusinessIntegration,
  getWindsorAuthUrl,
  selectWindsorLocation
} from "../../services/integrations/googleBusiness";

export const BUSINESS_KEYS = {
  all: ["business-integration"] as const,
  details: () => [...BUSINESS_KEYS.all, "current"] as const,
};

export const useBusinessIntegration = (options?: any) => {
  return useQuery({
    queryKey: BUSINESS_KEYS.details(),
    queryFn: getGoogleBusinessIntegration,
    ...options,
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

export const useSaveWindsorBusiness = () => {
  return useMutation({
    mutationFn: (payload: SaveWindsorCredentialsPayload) =>
      saveWindsorCredentials(payload),
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: BUSINESS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      return response;
    },
  });
};

export const useWindsorAuth = (onWindowOpened?: (win: Window | null) => void) => {
  return useMutation({
    mutationFn: getWindsorAuthUrl,
    onSuccess: (data) => {
      if (data?.authUrl) {
        const win = window.open(data.authUrl, "_blank");
        if (onWindowOpened) {
          onWindowOpened(win);
        }
      }
    },
  });
};

export const useSelectWindsorLocation = () => {
  return useMutation({
    mutationFn: selectWindsorLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUSINESS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
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

export const useBusinessLocations = (enabled: boolean = true) => {
  return useQuery({
    queryKey: [...BUSINESS_KEYS.all, "locations"],
    queryFn: getGoogleBusinessLocations,
    enabled,
  });
};

export const useSyncBusinessProfiles = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  return useMutation({
    mutationFn: () => syncGoogleBusinessProfiles(token || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUSINESS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
};

export const useConnectBusinessLocation = () => {
  return useMutation({
    mutationFn: connectGoogleBusinessLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUSINESS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
};
