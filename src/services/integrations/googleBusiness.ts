import {
  GenerateAuthUrlRequest,
  GenerateAuthUrlResponse,
} from "../../types/integrations/googleCalendar";
import axios from "../axios";

export const generateGoogleBusinessAuthUrl = async (
  data: GenerateAuthUrlRequest
): Promise<GenerateAuthUrlResponse> => {
  const response = await axios.post<GenerateAuthUrlResponse>(
    `/google_business_integration`,
    data
  );
  return response.data;
};

export const fetchGoogleBusinessIntegration = async (): Promise<any> => {
  const response = await axios.get<any>("/google_business_integration");
  return response.data;
};

export const updateGoogleBusinessIntegration = async (
  integrationId: string,
  data: any
): Promise<any> => {
  const response = await axios.put<any>(
    `/google_business_integration/${integrationId}`,
    data
  );
  return response.data;
};
