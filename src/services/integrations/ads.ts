import {
  GenerateAuthUrlRequest,
  GenerateAuthUrlResponse,
} from "../../types/integrations/googleCalendar";
import axios from "../axios";

export const generateGoogleAdsAuthUrl = async (
  data: GenerateAuthUrlRequest
): Promise<GenerateAuthUrlResponse> => {
  const response = await axios.post<GenerateAuthUrlResponse>(
    `/google_ads_integration`,
    data
  );
  return response.data;
};

export const fetchGoogleAdsIntegration = async (): Promise<any> => {
  const response = await axios.get<any>("/google_ads_integration");
  return response.data;
};

export const updateGoogleAdsIntegration = async (
  integrationId: string,
  data: any
): Promise<any> => {
  const response = await axios.put<any>(
    `/google_ads_integration/${integrationId}`,
    data
  );
  return response.data;
};

// Meta
export const generateMetaAdsAuthUrl = async (
  data: GenerateAuthUrlRequest
): Promise<GenerateAuthUrlResponse> => {
  const response = await axios.post<GenerateAuthUrlResponse>(
    `/meta_ads_integration`,
    data
  );
  return response.data;
};

export const fetchMetaAdsIntegration = async (): Promise<any> => {
  const response = await axios.get<any>("/meta_ads_integration");
  return response.data;
};

export const updateMetaAdsIntegration = async (
  integrationId: string,
  data: any
): Promise<any> => {
  const response = await axios.put<any>(
    `/meta_ads_integration/${integrationId}`,
    data
  );
  return response.data;
};
