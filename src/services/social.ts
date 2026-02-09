import {
  IAuthUrlResponse,
  GetCredentialsResponse,
  PostAnalyticsResponse,
  RecentPostsResponse,
  SocialOverviewResponse,
  GBPPlatformOverviewResponse,
  IUpdateSocialPayload,
  SocialMediaCredential,
} from "../types/social";
import axios from "./axios";

// Get social media credentials (status, stats, etc.)
export const getSocialMediaCredentials =
  async (): Promise<GetCredentialsResponse> => {
    const response = await axios.get("/social-media/get-credentials");
    return response.data;
  };

// Generate Auth URL - Send platform in payload
export const getSocialAuthUrl = async (
  platform: string,
  platformKey: string,
): Promise<IAuthUrlResponse> => {
  const response = await axios.post<IAuthUrlResponse>(
    `/social-media/${platformKey}`,
    {
      platform,
    },
  );
  return response.data;
};

// Update social integration (toggle status)
export const updateSocialIntegration = async (
  id: string,
  payload: IUpdateSocialPayload,
): Promise<SocialMediaCredential> => {
  const response = await axios.put<SocialMediaCredential>(
    `/social-media/update-credential/${id}`,
    payload,
  );
  return response.data;
};

// Disconnect social integration
export const deleteSocialIntegration = async (id: string): Promise<void> => {
  await axios.delete(`/social-media/delete-credential/${id}`);
};

// --- Other Social Post Services ---

export const fetchSocialOverview =
  async (): Promise<SocialOverviewResponse> => {
    const response = await axios.get("/social-media-post/");
    return response.data;
  };

export const fetchPostsAnalytics = async (): Promise<PostAnalyticsResponse> => {
  const response = await axios.get("/social-media-post/posts-analytics");
  return response.data;
};

export const fetchRecentPosts = async (
  page: number = 1,
  limit: number = 10,
): Promise<RecentPostsResponse> => {
  const response = await axios.get("/social-media-post/recent-posts", {
    params: { page, limit },
  });
  return response.data;
};

export const createSocialPost = async (payload: FormData): Promise<any> => {
  const response = await axios.post("/social-media-post/", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const fetchGoogleBusinessPlatformOverview =
  async (): Promise<GBPPlatformOverviewResponse> => {
    const response = await axios.get(
      "/social-media/google_business_platform_overview",
    );
    return response.data;
  };