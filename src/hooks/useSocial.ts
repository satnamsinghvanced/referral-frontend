import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
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
} from "../services/social";
import { GetCredentialsResponse, IUpdateSocialPayload } from "../types/social";

export const SOCIAL_MEDIA_QUERY_KEY = ["socialMediaCredentials"] as const;

// Fetch all social credentials
export const useSocialCredentials = (): UseQueryResult<
  GetCredentialsResponse,
  any
> => {
  return useQuery({
    queryKey: SOCIAL_MEDIA_QUERY_KEY,
    queryFn: getSocialMediaCredentials,
  });
};

// Connect to a social platform
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
    },
  });
};

// Update social integration
export const useUpdateSocial = () => {
  const queryClient = useQueryClient();
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
    },
  });
};

// Disconnect social integration
export const useDisconnectSocial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSocialIntegration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SOCIAL_MEDIA_QUERY_KEY });
    },
  });
};

// --- Other Social Post Hooks ---

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
  const queryClient = useQueryClient();
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

// Legacy exports for backward compatibility
export const useGetSocialMediaCredentials = useSocialCredentials;
export const useInitiateAuthIntegration = () => {
  const connect = useConnectSocial();
  return {
    ...connect,
    mutate: (params: { platform: string; platformKey?: string }) =>
      connect.mutate({
        platform: params.platform,
        platformKey: params.platformKey || `${params.platform}AuthIntegration`,
      }),
  } as any;
};
