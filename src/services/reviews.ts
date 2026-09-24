import {
  CreateGBPReviewPayload,
  CreateGBPReviewResponse,
  GBPLocationPerformanceResponse,
  GBPOverviewResponse,
  GBPRecentReviewsResponse,
} from "../types/reviews";
import axios from "./axios";

export const fetchGBPOverview = async (params?: { locationId?: string | undefined }): Promise<GBPOverviewResponse> => {
  const response = await axios.get("/google_business_profile/overview", { params });
  return response.data;
};

export const fetchGBPLocationPerformance = async (params?: { locationId?: string | undefined }): Promise<GBPLocationPerformanceResponse> => {
  const response = await axios.get("/google_business_profile/location-reviews", { params });
  return response.data;
};

export const fetchGBPRecentReviews = async (params?: { pageToken?: string; locationId?: string | undefined }): Promise<GBPRecentReviewsResponse> => {
  const response = await axios.get("/google_business_profile/recent-reviews", { params });
  return response.data;
};

export const createGBPReviewRequest = async (payload: CreateGBPReviewPayload): Promise<CreateGBPReviewResponse> => {
  const response = await axios.post("/google_business_profile/", payload);
  return response.data;
};

export const fetchFacebookReviews = async (): Promise<any> => {
  const response = await axios.get("/all-platform-reviews");
  return response.data;
};