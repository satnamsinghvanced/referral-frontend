import axios from "../axios";
import {
  NotificationSettingsResponse,
  UpdateNotificationPayload,
  NotificationsListResponse,
} from "../../types/notification";


export const fetchNotificationSettings =
  async (): Promise<NotificationSettingsResponse> => {
    const response = await axios.get("/notifications");
    return response.data;
  };

export const fetchInAppNotifications =
  async (): Promise<NotificationsListResponse> => {
    const response = await axios.get("/notifications/in-app");
    return response.data;
  };

export const markNotificationsAsRead = async (
  notificationIds: string[],
): Promise<any> => {
  const response = await axios.put("/notifications/mark-as-read", {
    notificationIds,
  });
  return response.data;
};

export const updateNotificationSettings = async (
  id: string,
  payload: UpdateNotificationPayload,
): Promise<NotificationSettingsResponse> => {
  const response = await axios.put(`/notifications/${id}`, payload);
  return response.data;
};
