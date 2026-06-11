import { addToast } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../providers/QueryProvider";
import {
  fetchTwilioConfig,
  saveTwilioConfig,
  updateTwilioConfig,
  fetchA2PRegistration,
  createA2PRegistration,
  updateA2PRegistration,
} from "../../services/integrations/twilio";
import {
  TwilioConfigRequest,
  TwilioConfigResponse,
} from "../../types/integrations/twilio";

export const twilioKeys = {
  all: ["twilio"] as const,
  details: () => [...twilioKeys.all] as const,
};

export const useFetchTwilioConfig = () =>
  useQuery<TwilioConfigResponse>({
    queryKey: twilioKeys.details(),
    queryFn: () => fetchTwilioConfig(),
  });

export const useSaveTwilioConfig = () =>
  useMutation<TwilioConfigResponse, Error, { data: TwilioConfigRequest }>({
    mutationFn: ({ data }) => saveTwilioConfig(data),
    onSuccess: (data) => {
      addToast({
        title: "Success",
        description: "Twilio keys saved successfully.",
        color: "success",
      });
      queryClient.invalidateQueries({
        queryKey: twilioKeys.details(),
      });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
    onError: (error: Error) => {
      addToast({
        title: "Error",
        description: error.message || "Failed to save Twilio keys",
        color: "danger",
      });
    },
  });

export const useUpdateTwilioConfig = () =>
  useMutation<
    TwilioConfigResponse,
    Error,
    { id: string; data: TwilioConfigRequest }
  >({
    mutationFn: ({ id, data }) => updateTwilioConfig(id, data),
    onSuccess: (data) => {
      addToast({
        title: "Success",
        description: "Twilio keys updated successfully.",
        color: "success",
      });
      queryClient.invalidateQueries({
        queryKey: twilioKeys.details(),
      });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
    onError: (error: Error) => {
      addToast({
        title: "Error",
        description: error.message || "Failed to update Twilio keys",
        color: "danger",
      });
    },
  });

export const useFetchA2PRegistration = () =>
  useQuery<any>({
    queryKey: ["twilio", "a2p"],
    queryFn: () => fetchA2PRegistration(),
  });

export const useSaveA2PRegistration = () =>
  useMutation<any, Error, any>({
    mutationFn: (data) => createA2PRegistration(data),
    onSuccess: () => {
      addToast({
        title: "Success",
        description: "A2P SMS Registration submitted successfully.",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["twilio", "a2p"] });
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to submit A2P SMS Registration",
        color: "danger",
      });
    },
  });

export const useUpdateA2PRegistration = () =>
  useMutation<any, Error, any>({
    mutationFn: (data) => updateA2PRegistration(data),
    onSuccess: () => {
      addToast({
        title: "Success",
        description: "A2P SMS Registration updated successfully.",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["twilio", "a2p"] });
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to update A2P SMS Registration",
        color: "danger",
      });
    },
  });
