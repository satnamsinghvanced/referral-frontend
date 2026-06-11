import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../providers/QueryProvider";
import {
  deleteGoogleCalendarIntegration,
  getGoogleCalendarAuthUrl,
  getGoogleCalendarIntegration,
  listUserCalendars,
  selectCalendarForSync,
  updateGoogleCalendarIntegration,
} from "../../services/integrations/googleCalendar";

export const CALENDAR_KEYS = {
  all: ["calendar-integration"] as const,
  details: () => [...CALENDAR_KEYS.all, "current"] as const,
  calendars: () => [...CALENDAR_KEYS.all, "calendars"] as const,
};

export const useCalendarIntegration = () => {
  return useQuery({
    queryKey: CALENDAR_KEYS.details(),
    queryFn: getGoogleCalendarIntegration,
  });
};

export const useConnectCalendar = () => {
  return useMutation({
    mutationFn: getGoogleCalendarAuthUrl,
    onSuccess: (data) => {
      if (data.authUrl) {
        window.open(data.authUrl, "_blank");
      }
    },
  });
};

export const useUpdateCalendar = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      updateGoogleCalendarIntegration(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
};

export const useDisconnectCalendar = () => {
  return useMutation({
    mutationFn: deleteGoogleCalendarIntegration,
    onSuccess: () => {
      queryClient.setQueryData(CALENDAR_KEYS.details(), null);
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
};

export const useUserCalendars = (enabled = true) => {
  return useQuery({
    queryKey: CALENDAR_KEYS.calendars(),
    queryFn: () => listUserCalendars(),
    enabled,
  });
};

export const useSelectCalendarForSync = () => {
  return useMutation({
    mutationFn: selectCalendarForSync,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
};
