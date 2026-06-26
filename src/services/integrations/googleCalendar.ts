import {
  IAuthUrlResponse,
  ICalendarIntegration,
  IListUserCalendarsResponse,
  ISelectCalendarForSyncPayload,
  ISelectCalendarForSyncResponse,
  IUpdateCalendarPayload,
} from "../../types/integrations/googleCalendar";
import axios from "../axios";

export const getGoogleCalendarAuthUrl = async () => {
  const { data } = await axios.post<IAuthUrlResponse>(
    "/google-calendar-integration/auth-url",
  );
  return data;
};

export const getGoogleCalendarIntegration = async () => {
  const { data } = await axios.get<ICalendarIntegration>(
    "/google-calendar-integration/",
  );
  return data;
};

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

export const deleteGoogleCalendarIntegration = async (id: string) => {
  await axios.delete(`/google-calendar-integration/${id}`);
  return id;
};

export const listUserCalendars = async () => {
  const { data } = await axios.get<IListUserCalendarsResponse>(
    "/google-calendar-integration/calendars",
  );
  return data;
};

export const selectCalendarForSync = async (
  payload: ISelectCalendarForSyncPayload,
) => {
  const { data } = await axios.post<ISelectCalendarForSyncResponse>(
    "/google-calendar-integration/select-calendar",
    payload,
  );
  return data;
};
