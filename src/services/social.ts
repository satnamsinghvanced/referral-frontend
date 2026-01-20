import {
  AuthIntegrationResponse,
  GetCredentialsResponse,
  PlatformAuthParams,
  PostAnalyticsResponse,
  RecentPostsResponse,
  SocialOverviewResponse,
  GBPPlatformOverviewResponse,
} from "../types/social";
import axios from "./axios";

export const getSocialMediaCredentials =
  async (): Promise<GetCredentialsResponse> => {
    const response = await axios.get("/social-media/get-credentials");
    return response.data;
  };

export const initiateAuthIntegration = async ({
  platform,
  userId,
  clientId,
  clientSecret,
  redirectUri,
}: PlatformAuthParams): Promise<AuthIntegrationResponse> => {
  const endpointMap: Record<PlatformAuthParams["platform"], string> = {
    linkedin: "/social-media/linkedinAuthIntegration",
    youTube: "/social-media/youtubeAuthIntegration",
    twitter: "/social-media/twitterAuthIntegration",
    tikTok: "/social-media/tiktokAuthIntegration",
    meta: "/social-media/metaAuthIntegration",
    googleBusiness: "/social-media/googleBusinessAuthIntegration",
  };

  const endpoint = endpointMap[platform];

  const response = await axios.post(endpoint, {
    userId,
    clientId,
    clientSecret,
    redirectUri,
  });

  return response.data;
};

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
