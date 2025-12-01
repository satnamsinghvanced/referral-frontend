// GOOGLE CALENDAR

export interface GenerateAuthUrlRequest {
  userId: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface GenerateAuthUrlResponse {
  authUrl: string;
}

export interface GoogleCalendarIntegrationResponse {
  _id: string;
  userId: string;
  platform: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  refreshToken?: string;
  accessToken?: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  lastSyncAt: string;
}

export interface UpdateGoogleCalendarRequest {
  platform?: string;
  clientId?: string;
  clientSecret?: string;
  redirectUri?: string;
  accessToken?: string;
  refreshToken?: string;
  status?: string;
}
