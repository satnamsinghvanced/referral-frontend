import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  getSocialMediaCredentials,
  initiateAuthIntegration,
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
  const queryClient = useQueryClient();

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
