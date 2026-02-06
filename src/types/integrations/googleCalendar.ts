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
}

export interface IAuthUrlResponse {
  authUrl: string;
}

export interface IUpdateCalendarPayload {
  isActive?: boolean;
  status?: string;
}

// Legacy types for backward compatibility with other integrations
export interface GenerateAuthUrlRequest {
  userId: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface GenerateAuthUrlResponse {
  authUrl: string;
}
