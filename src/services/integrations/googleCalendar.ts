import {
  GenerateAuthUrlRequest,
  GenerateAuthUrlResponse,
  GoogleCalendarIntegrationResponse,
  UpdateGoogleCalendarRequest,
} from "../../types/integrations/googleCalendar";
import axios from "../axios";

const CALENDAR_BASE = "/google-calendar";
const INTEGRATION_BASE = "/google-calendar-integration";

export const generateGoogleCalendarAuthUrl = async (
  data: GenerateAuthUrlRequest
): Promise<GenerateAuthUrlResponse> => {
  const response = await axios.post<GenerateAuthUrlResponse>(
    `${CALENDAR_BASE}/auth-url`,
    data
  );
  return response.data;
};

export const fetchGoogleCalendarIntegration =
  async (): Promise<GoogleCalendarIntegrationResponse> => {
    const response = await axios.get<GoogleCalendarIntegrationResponse>(
      INTEGRATION_BASE
    );
    return response.data;
  };

export const updateGoogleCalendarIntegration = async (
  integrationId: string,
  data: UpdateGoogleCalendarRequest
): Promise<GoogleCalendarIntegrationResponse> => {
  const response = await axios.put<GoogleCalendarIntegrationResponse>(
    `${INTEGRATION_BASE}/${integrationId}`,
    data
  );
  return response.data;
};
