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
  accountName?: string;
  accountEmail?: string;
  accountAvatar?: string;
  customerAccounts?: {
    customerId: string;
    descriptiveName: string;
    currencyCode: string;
    timeZone: string;
    isConnected: boolean;
  }[];
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
  accountName?: string;
  accountEmail?: string;
  accountAvatar?: string;
  adAccounts?: {
    adAccountId: string;
    name: string;
    accountStatus: number;
    currency: string;
    timezone: string;
    isConnected: boolean;
  }[];
}

export interface IUpdateAdsPayload {
  isActive?: boolean;
  status?: string;
}


export const getGoogleAdsAuthUrl = async () => {
  const { data } = await axios.post<IAuthUrlResponse>(
    "/google_ads_integration",
  );
  return data;
};


export const getGoogleAdsIntegration = async () => {
  const { data } = await axios.get<IGoogleAdsIntegration>(
    "/google_ads_integration",
  );
  return data;
};

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

export const deleteGoogleAdsIntegration = async (id: string) => {
  await axios.delete(`/google_ads_integration/${id}`);
  return id;
};


export const getMetaAdsAuthUrl = async () => {
  const { data } = await axios.post<IAuthUrlResponse>("/meta_ads_integration");
  return data;
};

export const getMetaAdsIntegration = async () => {
  const { data } = await axios.get<IMetaAdsIntegration>(
    "/meta_ads_integration",
  );
  return data;
};

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

export const deleteMetaAdsIntegration = async (id: string) => {
  await axios.delete(`/meta_ads_integration/${id}`);
  return id;
};
export const syncGoogleAdsAccounts = async (token: string) => {
  const { data } = await axios.get<{ customerAccounts: any[] }>(
    "/google_ads_integration/sync-profiles",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return data;
};

export const getGoogleAdsAccounts = async () => {
  const { data } = await axios.get<{ customerAccounts: any[] }>(
    "/google_ads_integration/locations",
  );
  return data;
};

export const connectGoogleAdsAccount = async (customerId: string) => {
  const { data } = await axios.post("/google_ads_integration/connect-location", {
    customerId,
  });
  return data;
};


export const syncMetaAdsAccounts = async (token: string) => {
  const { data } = await axios.get<{ adAccounts: any[] }>(
    "/meta_ads_integration/sync-profiles",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return data;
};

export const getMetaAdsAccounts = async () => {
  const { data } = await axios.get<{ adAccounts: any[] }>(
    "/meta_ads_integration/locations",
  );
  return data;
};

export const connectMetaAdsAccount = async (adAccountId: string) => {
  const { data } = await axios.post("/meta_ads_integration/connect-location", {
    adAccountId,
  });
  return data;
};
