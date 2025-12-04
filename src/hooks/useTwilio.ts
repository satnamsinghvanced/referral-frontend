import { addToast } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../providers/QueryProvider";
import {
  fetchTwilioConfig,
  getCallHistory,
  initiateCall,
  saveTwilioConfig,
  updateTwilioConfig,
} from "../services/twilio";
import {
  TwilioCallHistoryResponse,
  TwilioCallRequestBody,
  TwilioConfigRequest,
  TwilioConfigResponse,
  UserIdParam,
} from "../types/call";

export const twilioKeys = {
  all: ["twilio"] as const,
  details: (userId: string) => [...twilioKeys.all, userId] as const,
};

export const useFetchTwilioConfig = (userId: UserIdParam["userId"]) =>
  useQuery<TwilioConfigResponse>({
    queryKey: twilioKeys.details(userId),
    queryFn: () => fetchTwilioConfig(userId),
    enabled: !!userId,
  });

export const useSaveTwilioConfig = () =>
  useMutation<
    TwilioConfigResponse,
    Error,
    { userId: string; data: TwilioConfigRequest }
  >({
    mutationFn: ({ userId, data }) => saveTwilioConfig(userId, data),
    onSuccess: (data) => {
      addToast({
        title: "Success",
        description: "Twilio keys saved successfully.",
        color: "success",
      });
      queryClient.invalidateQueries({
        queryKey: twilioKeys.details(data.userId),
      });
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
    { userId: string; data: TwilioConfigRequest }
  >({
    mutationFn: ({ userId, data }) => updateTwilioConfig(userId, data),
    onSuccess: (data) => {
      addToast({
        title: "Success",
        description: "Twilio keys updated successfully.",
        color: "success",
      });
      queryClient.invalidateQueries({
        queryKey: twilioKeys.details(data.userId),
      });
    },
    onError: (error: Error) => {
      addToast({
        title: "Error",
        description: error.message || "Failed to update Twilio keys",
        color: "danger",
      });
    },
  });

export const useInitiateCall = (userId: string) =>
  useMutation({
    mutationFn: (body: TwilioCallRequestBody) => initiateCall(userId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["twilioCallHistory", userId],
      });
      addToast({
        title: "Success",
        description: "Calling...",
        color: "success",
      });
    },
    onError: (error: Error) => {
      addToast({
        title: "Error",
        description: error.message || "Failed to initiate call",
        color: "danger",
      });
    },
  });

export const useCallHistory = (userId: string) =>
  useQuery<TwilioCallHistoryResponse, Error>({
    queryKey: ["twilioCallHistory", userId],
    queryFn: () => getCallHistory(userId),
    enabled: !!userId,
  });
