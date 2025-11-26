import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  return useMutation<GenerateAuthUrlResponse, Error, GenerateAuthUrlRequest>({
    mutationFn: (data) => generateGoogleCalendarAuthUrl(data),
    onSuccess: (data) => {},
  });
};

export const useFetchGoogleCalendarIntegration = () => {
  return useQuery<GoogleCalendarIntegrationResponse, Error>({
    queryKey: GOOGLE_CALENDAR_KEYS.integration(),
    queryFn: fetchGoogleCalendarIntegration,
  });
};

export const useUpdateGoogleCalendarIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation<
    GoogleCalendarIntegrationResponse,
    Error,
    { id: string; data: UpdateGoogleCalendarRequest }
  >({
    mutationFn: ({ id, data }) => updateGoogleCalendarIntegration(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: GOOGLE_CALENDAR_KEYS.integration(),
      });
    },
  });
};
