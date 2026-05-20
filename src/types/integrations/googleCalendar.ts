export interface ICalendarIntegration {
  _id: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  calendarId: string;
  platform: "google_calendar";
  status: "Connected" | "Disconnected" | "Error";
  isActive: boolean;
  lastSyncAt: string;
  channelId: string;
  resourceId: string;
  expiration: number;
  createdAt: string;
  updatedAt: string;
  accountName?: string;
  accountEmail?: string;
  accountAvatar?: string;
}

export interface IAuthUrlResponse {
  authUrl: string;
}

export interface IUpdateCalendarPayload {
  isActive?: boolean;
  status?: string;
}

export interface IUserCalendarItem {
  id: string;
  name: string;
  isPrimary: boolean;
  accessRole: string | null;
}

export interface IListUserCalendarsResponse {
  selectedCalendarId: string | null;
  calendars: IUserCalendarItem[];
}

export interface ISelectCalendarForSyncPayload {
  calendarId: string | string[];
}

export interface ISelectCalendarForSyncResponse {
  calendarId: string;
  name: string | null;
}

export interface GenerateAuthUrlRequest {
  userId: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface GenerateAuthUrlResponse {
  authUrl: string;
}
