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

const unwrapApiData = <T>(response: any): T =>
  (response?.data !== undefined ? response.data : response) as T;

export const getSocialMediaCredentials =
  async (): Promise<GetCredentialsResponse> => {
    const response = await axios.get("/social-media/get-credentials");
    return unwrapApiData<GetCredentialsResponse>(response);
  };

export const getSocialAuthUrl = async (platform: string, platformKey: string): Promise<IAuthUrlResponse> => {
  const response = await axios.post<IAuthUrlResponse>(`/social-media/${platformKey}`, { platform, });
  return response.data;
};

export const updateSocialIntegration = async (id: string, payload: IUpdateSocialPayload): Promise<SocialMediaCredential> => {
  const response = await axios.put<SocialMediaCredential>(`/social-media/update-credential/${id}`, payload);
  return response.data;
};

export const deleteSocialIntegration = async (id: string): Promise<void> => {
  await axios.delete(`/social-media/delete-credential/${id}`);
};

export const deleteSocialPost = async (id: string): Promise<void> => {
  await axios.delete(`/social-media-post/${id}`);
};


export const fetchSocialOverview =
  async (): Promise<SocialOverviewResponse> => {
    const response = await axios.get("/social-media-post/");
    return unwrapApiData<SocialOverviewResponse>(response);
  };

export const fetchPostsAnalytics = async (): Promise<PostAnalyticsResponse> => {
  const response = await axios.get("/social-media-post/posts-analytics");
  return unwrapApiData<PostAnalyticsResponse>(response);
};

export const fetchRecentPosts = async (page: number = 1, limit: number = 10, status?: string): Promise<RecentPostsResponse> => {
  const params: any = { page, limit };
  if (status && status !== "all") {
    params.status = status;
  }
  const response = await axios.get("/social-media-post/recent-posts", { params });
  return unwrapApiData<RecentPostsResponse>(response);
};

export const createSocialPost = async (payload: FormData, onUploadProgress?: (progressEvent: any) => void): Promise<any> => {
  const response = await axios.post("/social-media-post/", payload, {
    headers: { "Content-Type": "multipart/form-data", },
    ...(onUploadProgress ? { onUploadProgress } : {}),
  });
  return response.data;
};

export const fetchPostStatus = async (id: string): Promise<any> => {
  const response = await axios.get(`/social-media-post/status/${id}`);
  return response.data;
};

export const fetchGoogleBusinessPlatformOverview = async (): Promise<GBPPlatformOverviewResponse> => {
  const response = await axios.get("/social-media/google_business_platform_overview");
  return response.data;
};

export interface SocialSubAccountsResponse {
  accounts: any[];
  connectedAccount?: {
    id: string;
    name: string;
    email?: string;
    isParentAccount?: boolean;
  } | null;
}

export const getSocialSubAccounts = async (
  platform: string,
): Promise<SocialSubAccountsResponse> => {
  const response = await axios.get(`/social-media/${platform}/sub-accounts`);
  return unwrapApiData<SocialSubAccountsResponse>(response);
};

export const syncSocialProfiles = async (
  platform: string,
): Promise<SocialSubAccountsResponse> => {
  const response = await axios.get(`/social-media/${platform}/sync-profiles`);
  return unwrapApiData<SocialSubAccountsResponse>(response);
};

export const connectSocialSubAccount = async (platform: string, accountId: string) => {
  const response = await axios.post(`/social-media/${platform}/connect-sub-account`, {
    accountId,
  });
  return response.data;
};