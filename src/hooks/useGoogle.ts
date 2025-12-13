import { addToast } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
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
    AxiosError,
    { userId: UserIdParam["userId"]; data: GoogleApiKeyRequest }
  >({
    mutationFn: ({ userId, data }) => saveGoogleApiKey(userId, data),

    onSuccess: (data) => {
      addToast({
        title: "Success",
        description: "Google API key saved successfully.",
        color: "success",
      });

      queryClient.invalidateQueries({
        queryKey: googleKeys.details(data.userId),
      });
    },

    onError: (error) => {
      const message =
        (error.response?.data as { error?: string })?.error ||
        error.message ||
        "Failed to save Google API key.";

      addToast({
        title: "Error",
        description: message,
        color: "danger",
      });
    },
  });
};

export const useUpdateGoogleApiKey = () => {
  return useMutation<
    GoogleApiKeyResponse,
    AxiosError,
    { userId: UserIdParam["userId"]; data: GoogleApiKeyRequest }
  >({
    mutationFn: ({ userId, data }) => updateGoogleApiKey(userId, data),

    onSuccess: (data) => {
      addToast({
        title: "Success",
        description: "Google API key updated successfully.",
        color: "success",
      });

      queryClient.invalidateQueries({
        queryKey: googleKeys.details(data.userId),
      });
    },

    onError: (error) => {
      const message =
        (error.response?.data as { error?: string })?.error ||
        error.message ||
        "Failed to update Google API key.";

      addToast({
        title: "Error",
        description: message,
        color: "danger",
      });
    },
  });
};
