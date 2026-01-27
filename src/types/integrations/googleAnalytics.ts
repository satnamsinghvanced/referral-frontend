export interface GoogleAnalyticsIntegration {
  id?: string;
  userId: string;
  propertyId: string;
  email: string;
  privateKey: string;
  status: "Connected" | "Disconnected" | "Error";
  lastSyncAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateGoogleAnalyticsRequest {
  propertyId?: string;
  email?: string;
  privateKey?: string;
  status?: "Connected" | "Disconnected" | "Error";
}
