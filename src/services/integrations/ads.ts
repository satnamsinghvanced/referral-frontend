import { IAuthUrlResponse } from "../../types/integrations/googleCalendar";
import axios from "../axios";

export interface IGoogleAdsIntegration {
  _id: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  customerId: string;
  platform: "google_ads";
  status: "Connected" | "Disconnected" | "Error";
  isActive: boolean;
  lastSyncAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface IMetaAdsIntegration {
  _id: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  adAccountId: string;
  platform: "meta_ads";
  status: "Connected" | "Disconnected" | "Error";
  isActive: boolean;
  lastSyncAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUpdateAdsPayload {
  isActive?: boolean;
  status?: string;
}

// ===== Google Ads =====

// Get the OAuth URL to initiate connection
export const getGoogleAdsAuthUrl = async () => {
  const { data } = await axios.post<IAuthUrlResponse>(
    "/google_ads_integration",
  );
  return data;
};

// Get current integration status
export const getGoogleAdsIntegration = async () => {
  const { data } = await axios.get<IGoogleAdsIntegration>(
    "/google_ads_integration",
  );
  return data;
};

// Update integration (e.g., toggle isActive)
export const updateGoogleAdsIntegration = async (
  id: string,
  payload: IUpdateAdsPayload,
) => {
  const { data } = await axios.put<IGoogleAdsIntegration>(
    `/google_ads_integration/${id}`,
    payload,
  );
  return data;
};

// Disconnect Google Ads
export const deleteGoogleAdsIntegration = async (id: string) => {
  await axios.delete(`/google_ads_integration/${id}`);
  return id;
};

// ===== Meta Ads =====

// Get the OAuth URL to initiate connection
export const getMetaAdsAuthUrl = async () => {
  const { data } = await axios.post<IAuthUrlResponse>("/meta_ads_integration");
  return data;
};

// Get current integration status
export const getMetaAdsIntegration = async () => {
  const { data } = await axios.get<IMetaAdsIntegration>(
    "/meta_ads_integration",
  );
  return data;
};

// Update integration (e.g., toggle isActive)
export const updateMetaAdsIntegration = async (
  id: string,
  payload: IUpdateAdsPayload,
) => {
  const { data } = await axios.put<IMetaAdsIntegration>(
    `/meta_ads_integration/${id}`,
    payload,
  );
  return data;
};

// Disconnect Meta Ads
export const deleteMetaAdsIntegration = async (id: string) => {
  await axios.delete(`/meta_ads_integration/${id}`);
  return id;
};
