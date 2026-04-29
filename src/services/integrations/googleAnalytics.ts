import {
  IAuthUrlResponse,
  IGoogleAnalyticsIntegration,
  IUpdateAnalyticsPayload,
} from "../../types/integrations/googleAnalytics";
import axios from "../axios";

// Get the OAuth URL to initiate connection
export const getGoogleAnalyticsAuthUrl = async () => {
  const { data } = await axios.post<IAuthUrlResponse>("/analytics-integration");
  return data;
};

// Get current integration status
export const getGoogleAnalyticsIntegration = async () => {
  const { data } = await axios.get<IGoogleAnalyticsIntegration>(
    "/analytics-integration",
  );
  return data;
};

// Update integration (e.g., toggle isActive)
export const updateGoogleAnalyticsIntegration = async (
  id: string,
  payload: IUpdateAnalyticsPayload,
) => {
  const { data } = await axios.put<IGoogleAnalyticsIntegration>(
    `/analytics-integration/${id}`,
    payload,
  );
  return data;
};

// Disconnect analytics
export const deleteGoogleAnalyticsIntegration = async (id: string) => {
  await axios.delete(`/analytics-integration/${id}`);
  return id;
};

// Get properties from DB
export const getGoogleAnalyticsProperties = async () => {
  const { data } = await axios.get<{ properties: any[] }>(
    "/analytics-integration/locations",
  );
  return data;
};

// Sync properties live from Google
export const syncGoogleAnalyticsProperties = async () => {
  const { data } = await axios.get<{ properties: any[] }>(
    "/analytics-integration/sync-profiles",
  );
  return data;
};

// Connect a specific property
export const connectGoogleAnalyticsProperty = async (propertyId: string) => {
  const { data } = await axios.post("/analytics-integration/connect-location", {
    propertyId,
  });
  return data;
};
