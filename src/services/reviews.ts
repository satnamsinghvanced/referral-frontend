import {
  CreateGBPReviewPayload,
  CreateGBPReviewResponse,
  GBPLocationPerformanceResponse,
  GBPOverviewResponse,
  GBPRecentReviewsResponse,
} from "../types/reviews";
import axios from "./axios";

export const fetchGBPOverview = async (): Promise<GBPOverviewResponse> => {
  const response = await axios.get("/google_business_profile/overview");
  return response.data;
};

export const fetchGBPLocationPerformance =
  async (): Promise<GBPLocationPerformanceResponse> => {
    const response = await axios.get(
      "/google_business_profile/location-reviews",
    );
    return response.data;
  };

export const fetchGBPRecentReviews = async (
  pageToken?: string,
): Promise<GBPRecentReviewsResponse> => {
  const response = await axios.get("/google_business_profile/recent-reviews", {
    params: { pageToken },
  });
  return response.data;
};

export const createGBPReviewRequest = async (
  payload: CreateGBPReviewPayload,
): Promise<CreateGBPReviewResponse> => {
  const response = await axios.post("/google_business_profile/", payload);
  return response.data;
};
