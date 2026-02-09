export interface IGoogleAnalyticsIntegration {
  _id: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  propertyId: string;
  platform: "google_analytics";
  status: "Connected" | "Disconnected" | "Error";
  isActive: boolean;
  lastSyncAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAuthUrlResponse {
  authUrl: string;
}

export interface IUpdateAnalyticsPayload {
  isActive?: boolean;
  status?: string;
}
