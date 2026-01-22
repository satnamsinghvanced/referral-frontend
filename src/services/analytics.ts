import {
  AdsIntegrationResponse,
  GeneralAnalyticsResponse,
  GoogleAnalyticsResponse,
} from "../types/analytics";
import axios from "./axios";

export const fetchGeneralAnalytics =
  async (): Promise<GeneralAnalyticsResponse> => {
    const response = await axios.get("/analytics");
    return response.data;
  };

export const fetchGoogleAnalytics =
  async (): Promise<GoogleAnalyticsResponse> => {
    const response = await axios.get("/google-analytics");
    return response.data;
  };

export const fetchGoogleAdsIntegration =
  async (): Promise<AdsIntegrationResponse> => {
    const response = await axios.get("/analytics/google_analytics");
    return response.data;
  };

export const fetchMetaAdsIntegration =
  async (): Promise<AdsIntegrationResponse> => {
    const response = await axios.get("/analytics/meta_analytics");
    return response.data;
  };
