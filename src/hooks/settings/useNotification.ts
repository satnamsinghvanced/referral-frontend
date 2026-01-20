import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../providers/QueryProvider";
import {
  fetchInAppNotifications,
  fetchNotificationSettings,
  markNotificationsAsRead,
  updateNotificationSettings,
} from "../../services/settings/notification";
import { UpdateNotificationPayload } from "../../types/notification";

export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications", "settings"],
    queryFn: fetchNotificationSettings,
  });
};

export const useInAppNotifications = () => {
  return useQuery({
    queryKey: ["notifications", "in-app"],
    queryFn: fetchInAppNotifications,
  });
};

export const useMarkNotificationsRead = () => {
  return useMutation({
    mutationFn: (notificationIds: string[]) =>
      markNotificationsAsRead(notificationIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "in-app"] });
    },
  });
};

export const useUpdateNotifications = () => {
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateNotificationPayload;
    }) => updateNotificationSettings(id, payload),
    onSuccess: () => {
      // Invalidate the cache to ensure the UI reflects the updated settings
      queryClient.invalidateQueries({
        queryKey: ["notifications", "settings"],
      });
    },
  });
};
