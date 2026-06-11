import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { queryClient } from "../providers/QueryProvider";
import {
  createSocialPost,
  deleteSocialIntegration,
  fetchGoogleBusinessPlatformOverview,
  fetchPostsAnalytics,
  fetchRecentPosts,
  fetchSocialOverview,
  getSocialAuthUrl,
  getSocialMediaCredentials,
  updateSocialIntegration,
  getSocialSubAccounts,
  syncSocialProfiles,
  connectSocialSubAccount,
} from "../services/social";
import type { SocialPlatformType } from "../pages/social-media/modal/SocialSubAccountSelectorModal";
import { GetCredentialsResponse, IUpdateSocialPayload } from "../types/social";
export const SOCIAL_MEDIA_QUERY_KEY = ["socialMediaCredentials"] as const;
export const useSocialCredentials = (): UseQueryResult<
  GetCredentialsResponse,
  any
> => {
  return useQuery({
    queryKey: SOCIAL_MEDIA_QUERY_KEY,
    queryFn: getSocialMediaCredentials,
  });
};

export const useConnectSocial = () => {
  return useMutation({
    mutationFn: ({
      platform,
      platformKey,
    }: {
      platform: string;
      platformKey: string;
    }) => getSocialAuthUrl(platform, platformKey),
    onSuccess: (data) => {
      if (data.authUrl) {
        window.open(data.authUrl, "_blank");
      }
      queryClient.invalidateQueries({ queryKey: SOCIAL_MEDIA_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["social-overview"] });
      queryClient.invalidateQueries({ queryKey: ["recent-posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts-analytics"] });
    },
  });
};

export const useUpdateSocial = () => {
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: IUpdateSocialPayload;
    }) => updateSocialIntegration(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SOCIAL_MEDIA_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["social-overview"] });
      queryClient.invalidateQueries({ queryKey: ["recent-posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts-analytics"] });
    },
  });
};

export const useDisconnectSocial = () => {
  return useMutation({
    mutationFn: deleteSocialIntegration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SOCIAL_MEDIA_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["social-overview"] });
      queryClient.invalidateQueries({ queryKey: ["recent-posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts-analytics"] });
    },
  });
};

export const useSocialOverview = () => {
  return useQuery({
    queryKey: ["social-overview"],
    queryFn: fetchSocialOverview,
  });
};

export const usePostsAnalytics = () => {
  return useQuery({
    queryKey: ["posts-analytics"],
    queryFn: fetchPostsAnalytics,
  });
};

export const useRecentPosts = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["recent-posts", page, limit],
    queryFn: () => fetchRecentPosts(page, limit),
  });
};

export const useCreateSocialPost = () => {
  return useMutation({
    mutationFn: (formData: FormData) => createSocialPost(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-overview"] });
      queryClient.invalidateQueries({ queryKey: ["recent-posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts-analytics"] });
    },
  });
};

export const useGoogleBusinessPlatformOverview = () => {
  return useQuery({
    queryKey: ["google-business-platform-overview"],
    queryFn: fetchGoogleBusinessPlatformOverview,
  });
};

const subAccountKey = (platform: SocialPlatformType) =>
  [...SOCIAL_MEDIA_QUERY_KEY, "sub-accounts", platform] as const;

export const useSocialSubAccounts = (
  platform: SocialPlatformType,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: subAccountKey(platform),
    queryFn: () => getSocialSubAccounts(platform),
    enabled,
  });
};

export const useSyncSocialProfiles = (platform: SocialPlatformType) => {
  return useMutation({
    mutationFn: () => syncSocialProfiles(platform),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subAccountKey(platform) });
      queryClient.invalidateQueries({ queryKey: SOCIAL_MEDIA_QUERY_KEY });
    },
  });
};

export const useConnectSocialSubAccount = (platform: SocialPlatformType) => {
  return useMutation({
    mutationFn: (accountId: string) => connectSocialSubAccount(platform, accountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subAccountKey(platform) });
      queryClient.invalidateQueries({ queryKey: SOCIAL_MEDIA_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["social-overview"] });
      queryClient.invalidateQueries({ queryKey: ["recent-posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts-analytics"] });
    },
  });
};
