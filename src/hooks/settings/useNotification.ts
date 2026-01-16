import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchNotificationSettings,
  updateNotificationSettings,
  fetchInAppNotifications,
  markNotificationAsRead,
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

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "in-app"] });
    },
  });
};

export const useUpdateNotifications = () => {
  const queryClient = useQueryClient();

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
