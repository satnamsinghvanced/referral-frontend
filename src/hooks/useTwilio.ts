import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../providers/QueryProvider";
import {
  fetchTwilioConfig,
  getCallHistory,
  initiateCall,
  saveTwilioConfig,
  updateTwilioConfig,
} from "../services/twilio"; // Import your Axios functions
import {
  TwilioCallHistoryResponse,
  TwilioCallRequestBody,
  TwilioConfigRequest,
  TwilioConfigResponse,
  UserIdParam,
} from "../types/call";
import { addToast } from "@heroui/react";

export const twilioKeys = {
  all: ["twilio"] as const,
  details: (userId: string) => [...twilioKeys.all, userId] as const,
};

export const useFetchTwilioConfig = (userId: UserIdParam["userId"]) => {
  return useQuery<TwilioConfigResponse>({
    queryKey: twilioKeys.details(userId),
    queryFn: () => fetchTwilioConfig(userId),
    enabled: !!userId, // Only run the query if userId is available
  });
};

export const useSaveTwilioConfig = () => {
  return useMutation<
    TwilioConfigResponse,
    Error,
    { userId: UserIdParam["userId"]; data: TwilioConfigRequest }
  >({
    mutationFn: ({ userId, data }) => saveTwilioConfig(userId, data),
    onSuccess: (data) => {
      // Invalidate the fetch query to show the newly saved data
      queryClient.invalidateQueries({
        queryKey: twilioKeys.details(data.userId),
      });
    },
  });
};

export const useUpdateTwilioConfig = () => {
  return useMutation<
    TwilioConfigResponse,
    Error,
    { userId: UserIdParam["userId"]; data: TwilioConfigRequest }
  >({
    mutationFn: ({ userId, data }) => updateTwilioConfig(userId, data),
    onSuccess: (data) => {
      // Invalidate the fetch query to show the updated data
      queryClient.invalidateQueries({
        queryKey: twilioKeys.details(data.userId),
      });
    },
  });
};

export const useInitiateCall = (userId: string) => {
  return useMutation({
    mutationFn: (body: TwilioCallRequestBody) => initiateCall(userId, body),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["twilioCallHistory", userId],
      });
      addToast({ title: "Success", description: "Calling..." });
    },

    onError: (error) => {
      console.error("Failed to initiate call:", error);
    },
  });
};

export const useCallHistory = (userId: string) => {
  return useQuery<TwilioCallHistoryResponse, Error>({
    queryKey: ["twilioCallHistory", userId],
    queryFn: () => getCallHistory(userId),
  });
};
