import {
  IAuthUrlResponse,
  IGoogleAnalyticsIntegration,
  IUpdateAnalyticsPayload,
} from "../../types/integrations/googleAnalytics";
import axios from "../axios";

export const getGoogleAnalyticsAuthUrl = async () => {
  const { data } = await axios.post<IAuthUrlResponse>("/analytics-integration");
  return data;
};

export const getGoogleAnalyticsIntegration = async () => {
  const { data } = await axios.get<IGoogleAnalyticsIntegration>(
    "/analytics-integration",
  );
  return data;
};

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

export const deleteGoogleAnalyticsIntegration = async (id: string) => {
  await axios.delete(`/analytics-integration/${id}`);
  return id;
};

export const getGoogleAnalyticsProperties = async () => {
  const { data } = await axios.get<{ properties: any[] }>(
    "/analytics-integration/locations",
  );
  return data;
};

export const syncGoogleAnalyticsProperties = async () => {
  const { data } = await axios.get<{ properties: any[] }>(
    "/analytics-integration/sync-profiles",
  );
  return data;
};

export const connectGoogleAnalyticsProperty = async (propertyId: string) => {
  const { data } = await axios.post("/analytics-integration/connect-location", {
    propertyId,
  });
  return data;
};
