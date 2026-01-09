import {
  AuthIntegrationResponse,
  GetCredentialsResponse,
  PlatformAuthParams,
} from "../types/social";
import axios from "./axios";

export const getSocialMediaCredentials =
  async (): Promise<GetCredentialsResponse> => {
    const response = await axios.get("/social-media/get-credentials");
    return response.data;
  };

export const initiateAuthIntegration = async ({
  platform,
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
    clientId,
    clientSecret,
    redirectUri,
  });

  return response.data;
};
