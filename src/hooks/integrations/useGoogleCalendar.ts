import { addToast } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../providers/QueryProvider";
import {
  fetchGoogleCalendarIntegration,
  generateGoogleCalendarAuthUrl,
  updateGoogleCalendarIntegration,
} from "../../services/integrations/googleCalendar";
import {
  GenerateAuthUrlRequest,
  GenerateAuthUrlResponse,
  GoogleCalendarIntegrationResponse,
  UpdateGoogleCalendarRequest,
} from "../../types/integrations/googleCalendar";

export const GOOGLE_CALENDAR_KEYS = {
  all: ["googleCalendar"] as const,
  integration: () => [...GOOGLE_CALENDAR_KEYS.all, "integration"] as const,
};

export const useGenerateGoogleCalendarAuthUrl = () => {
  return useMutation<GenerateAuthUrlResponse, any, GenerateAuthUrlRequest>({
    mutationFn: (data) => generateGoogleCalendarAuthUrl(data),

    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Google calendar connected successfully",
        color: "success",
      });

      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },

    onError: (error) => {
      const errorMessage =
        (error?.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to connect Google calender";

      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });
};

export const useFetchGoogleCalendarIntegration = () => {
  return useQuery<GoogleCalendarIntegrationResponse, Error>({
    queryKey: GOOGLE_CALENDAR_KEYS.integration(),
    queryFn: fetchGoogleCalendarIntegration,
  });
};

export const useUpdateGoogleCalendarIntegration = () => {
  return useMutation<
    GoogleCalendarIntegrationResponse,
    any,
    { id: string; data: UpdateGoogleCalendarRequest }
  >({
    mutationFn: ({ id, data }) => updateGoogleCalendarIntegration(id, data),

    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Google Calendar integration updated successfully",
        color: "success",
      });

      queryClient.invalidateQueries({
        queryKey: GOOGLE_CALENDAR_KEYS.integration(),
      });

      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },

    onError: (error) => {
      const errorMessage =
        (error?.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to update Google Calendar integration";

      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    },
  });
};
