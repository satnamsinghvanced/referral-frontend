import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import { queryClient } from "../providers/QueryProvider";
import {
  createSocialPost,
  fetchPostsAnalytics,
  fetchRecentPosts,
  fetchSocialOverview,
  getSocialMediaCredentials,
  initiateAuthIntegration,
  fetchGoogleBusinessPlatformOverview,
} from "../services/social";
import {
  AuthIntegrationResponse,
  GetCredentialsResponse,
  PlatformAuthParams,
} from "../types/social";

const SOCIAL_MEDIA_QUERY_KEY = ["socialMediaCredentials"];

export const useGetSocialMediaCredentials = (): UseQueryResult<
  GetCredentialsResponse,
  any
> => {
  return useQuery({
    queryKey: SOCIAL_MEDIA_QUERY_KEY,
    queryFn: getSocialMediaCredentials,
  });
};

export const useInitiateAuthIntegration = (): UseMutationResult<
  AuthIntegrationResponse,
  any,
  PlatformAuthParams
> => {
  return useMutation({
    mutationFn: initiateAuthIntegration,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: SOCIAL_MEDIA_QUERY_KEY });
    },
    onError: (error) => {
      console.error("Failed to initiate authentication:", error);
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
      // Refresh lists after a new post is created
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
