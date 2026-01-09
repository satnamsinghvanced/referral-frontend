export interface SocialMediaCredential {
  _id: string;
  userId: string;
  platform:
    | "linkedin"
    | "youTube"
    | "twitter"
    | "tikTok"
    | "meta"
    | "googleBusiness";
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  refreshToken: string;
  accessToken: string;
  status: "connected" | "notConnected";
  createdAt: string;
  updatedAt: string;
}

export interface GetCredentialsResponse {
  linkedin: SocialMediaCredential;
  youTube: SocialMediaCredential;
  twitter: SocialMediaCredential;
  tikTok: SocialMediaCredential;
  [key: string]: SocialMediaCredential;
}

export interface AuthIntegrationRequest {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface AuthIntegrationResponse {
  integrationId: string;
  authUrl: string;
}

export interface PlatformAuthParams extends AuthIntegrationRequest {
  platform:
    | "linkedin"
    | "youTube"
    | "twitter"
    | "tikTok"
    | "meta"
    | "googleBusiness";
}
