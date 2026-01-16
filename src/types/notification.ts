export interface InAppNotification {
  _id: string;
  userId: string;
  type: "success" | "info" | "warning" | "error" | "neutral";
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
  updatedAt: string;
}

export type NotificationsListResponse = InAppNotification[];

export interface ActiveHours {
  enabled: boolean;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
}

export interface NotificationItem {
  _id?: string;
  label: "newPatientReferrals" | "urgentReferrals" | "newReviews" | string;
  enabled: boolean;
  push: boolean;
  email: boolean;
  sms: boolean;
  inApp: boolean;
  activeHours: ActiveHours;
}

export interface BrowserSettings {
  browserId: string;
  status: string;
  endpoint: string;
  p256dh: string;
  auth: string;
}

export interface NotificationSettingsResponse {
  _id: string;
  userId: string;
  globalEnabled: boolean;
  browser: BrowserSettings;
  notifications: NotificationItem[];
  vapidPublicKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateNotificationPayload {
  globalEnabled: boolean;
  notifications: Omit<NotificationItem, "_id">[];
}
