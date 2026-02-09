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
}

export interface IUpdateBusinessPayload {
  isActive?: boolean;
  status?: string;
}

// Get the OAuth URL to initiate connection
export const getGoogleBusinessAuthUrl = async () => {
  const { data } = await axios.post<IAuthUrlResponse>(
    "/google_business_integration",
  );
  return data;
};

// Get current integration status
export const getGoogleBusinessIntegration = async () => {
  const { data } = await axios.get<IGoogleBusinessIntegration>(
    "/google_business_integration",
  );
  return data;
};

// Update integration (e.g., toggle isActive)
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

// Disconnect business
export const deleteGoogleBusinessIntegration = async (id: string) => {
  await axios.delete(`/google_business_integration/${id}`);
  return id;
};
