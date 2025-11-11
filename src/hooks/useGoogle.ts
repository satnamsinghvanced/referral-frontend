import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../providers/QueryProvider";
import {
  fetchGoogleApiKey,
  saveGoogleApiKey,
  updateGoogleApiKey,
} from "../services/google";
import {
  GoogleApiKeyRequest,
  GoogleApiKeyResponse,
  UserIdParam,
} from "../types/google";
import { addToast } from "@heroui/react";

export const googleKeys = {
  all: ["googleApi"] as const,
  details: (userId: string) => [...googleKeys.all, userId] as const,
};

export const useFetchGoogleApiKey = (userId: UserIdParam["userId"]) => {
  return useQuery<GoogleApiKeyResponse>({
    queryKey: googleKeys.details(userId),
    queryFn: () => fetchGoogleApiKey(userId),
    enabled: !!userId,
  });
};

export const useSaveGoogleApiKey = () => {
  return useMutation<
    GoogleApiKeyResponse,
    Error,
    { userId: UserIdParam["userId"]; data: GoogleApiKeyRequest }
  >({
    mutationFn: ({ userId, data }) => saveGoogleApiKey(userId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: googleKeys.details(data.userId),
      });
    },
  });
};

export const useUpdateGoogleApiKey = () => {
  return useMutation<
    GoogleApiKeyResponse,
    Error,
    { userId: UserIdParam["userId"]; data: GoogleApiKeyRequest }
  >({
    mutationFn: ({ userId, data }) => updateGoogleApiKey(userId, data),
    onSuccess: (data) => {
      addToast({
        title: "Success",
        description: "Google keys updated successfully.",
        color: "success",
      });
      queryClient.invalidateQueries({
        queryKey: googleKeys.details(data.userId),
      });
    },
  });
};
