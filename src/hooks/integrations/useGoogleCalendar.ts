import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteGoogleCalendarIntegration,
  getGoogleCalendarAuthUrl,
  getGoogleCalendarIntegration,
  updateGoogleCalendarIntegration,
} from "../../services/integrations/googleCalendar";

export const CALENDAR_KEYS = {
  all: ["calendar-integration"] as const,
  details: () => [...CALENDAR_KEYS.all, "current"] as const,
};

// --- Queries ---

export const useCalendarIntegration = () => {
  return useQuery({
    queryKey: CALENDAR_KEYS.details(),
    queryFn: getGoogleCalendarIntegration,
  });
};

// --- Mutations ---

export const useConnectCalendar = () => {
  return useMutation({
    mutationFn: getGoogleCalendarAuthUrl,
    onSuccess: (data) => {
      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    },
  });
};

export const useUpdateCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      updateGoogleCalendarIntegration(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEYS.all });
    },
  });
};

export const useDisconnectCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGoogleCalendarIntegration,
    onSuccess: () => {
      queryClient.setQueryData(CALENDAR_KEYS.details(), null);
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEYS.all });
    },
  });
};
