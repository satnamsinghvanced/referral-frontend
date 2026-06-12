import { IAuthUrlResponse } from "../../types/integrations/googleCalendar";
import axios from "../axios";

export interface IGoogleBusinessIntegration {
  _id: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  accountId: string;
  platform: "google_business";
  status: "Connected" | "Disconnected" | "Error";
  isActive: boolean;
  lastSyncAt: string;
  createdAt: string;
  updatedAt: string;
  accountName?: string;
  accountEmail?: string;
  accountAvatar?: string;
  locations?: {
    accountId: string;
    locationId: string;
    name: string;
    address: string;
    primaryCategory: string;
    isConnected: boolean;
  }[];
}

export interface IUpdateBusinessPayload {
  isActive?: boolean;
  status?: string;
}

export interface SaveWindsorCredentialsPayload {
  windsorApiKey: string;
  windsorLocationId: string;
}

export const getGoogleBusinessAuthUrl = async () => {
  const { data } = await axios.post<IAuthUrlResponse>(
    "/google_business_integration",
  );
  return data;
};

export const saveWindsorCredentials = async (
  payload: SaveWindsorCredentialsPayload
) => {
  const { data } = await axios.post(
    "/v1/integrations/windsor/save",
    payload
  );
  return data;
};

export const getWindsorAuthUrl = async () => {
  const { data } = await axios.get<IAuthUrlResponse>(
    "/v1/integrations/windsor/auth"
  );
  return data;
};

export const selectWindsorLocation = async (locationId: string) => {
  const { data } = await axios.post(
    "/v1/integrations/windsor/select-location",
    { locationId }
  );
  return data;
};

export const getGoogleBusinessIntegration = async () => {
  const { data } = await axios.get<IGoogleBusinessIntegration>(
    "/google_business_integration",
  );
  return data;
};

export const updateGoogleBusinessIntegration = async (
  id: string,
  payload: IUpdateBusinessPayload,
) => {
  const { data } = await axios.put<IGoogleBusinessIntegration>(
    `/google_business_integration/${id}`,
    payload,
  );
  return data;
};

export const deleteGoogleBusinessIntegration = async (id: string) => {
  await axios.delete(`/google_business_integration/${id}`);
  return id;
};

export const getGoogleBusinessLocations = async () => {
  const { data } = await axios.get<{ locations: any[] }>(
    "/google_business_integration/locations",
  );
  return data;
};

export const syncGoogleBusinessProfiles = async (token: string) => {
  const { data } = await axios.get<{ locations: any[] }>(
    "/google_business_integration/sync-profiles",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return data;
};

export const connectGoogleBusinessLocation = async (locationId: string) => {
  const { data } = await axios.post(
    "/google_business_integration/connect-location",
    { locationId },
  );
  return data;
};

export const connectGooglePlaces = async (placeId: string) => {
  const { data } = await axios.post(
    "/google_business_integration/connect-places",
    { placeId },
  );
  return data;
};
