import {
  GoogleAnalyticsIntegration,
  UpdateGoogleAnalyticsRequest,
} from "../../types/integrations/googleAnalytics";
import axios from "../axios";

const ANALYTICS_BASE = "/analytics-integration";

export const fetchGoogleAnalyticsIntegration =
  async (): Promise<GoogleAnalyticsIntegration> => {
    const response =
      await axios.get<GoogleAnalyticsIntegration>(ANALYTICS_BASE);
    return response.data;
  };

export const updateGoogleAnalyticsIntegration = async (
  integrationId: string,
  data: UpdateGoogleAnalyticsRequest,
): Promise<GoogleAnalyticsIntegration> => {
  const response = await axios.put<GoogleAnalyticsIntegration>(
    `${ANALYTICS_BASE}/${integrationId}`,
    data,
  );
  return response.data;
};

export const createGoogleAnalyticsIntegration = async (
  data: Partial<GoogleAnalyticsIntegration>,
): Promise<GoogleAnalyticsIntegration> => {
  const response = await axios.post<GoogleAnalyticsIntegration>(
    ANALYTICS_BASE,
    data,
  );
  return response.data;
};
