import {
  IAuthUrlResponse,
  ICalendarIntegration,
  IUpdateCalendarPayload,
} from "../../types/integrations/googleCalendar";
import axios from "../axios";

// Get the OAuth URL to initiate connection
export const getGoogleCalendarAuthUrl = async () => {
  const { data } = await axios.post<IAuthUrlResponse>(
    "/google-calendar-integration/auth-url",
  );
  return data;
};

// Get current integration status
export const getGoogleCalendarIntegration = async () => {
  const { data } = await axios.get<ICalendarIntegration>(
    "/google-calendar-integration/",
  );
  return data;
};

// Update integration (e.g., toggle isActive)
export const updateGoogleCalendarIntegration = async (
  id: string,
  payload: IUpdateCalendarPayload,
) => {
  const { data } = await axios.put<ICalendarIntegration>(
    `/google-calendar-integration/${id}`,
    payload,
  );
  return data;
};

// Disconnect calendar
export const deleteGoogleCalendarIntegration = async (id: string) => {
  await axios.delete(`/google-calendar-integration/${id}`);
  return id;
};
