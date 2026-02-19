export interface SocialMediaCredential {
  id: string;
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
  followers: number;
  engagementRate: number;
}

export interface GetCredentialsResponse {
  linkedin: SocialMediaCredential;
  youTube: SocialMediaCredential;
  twitter: SocialMediaCredential;
  tikTok: SocialMediaCredential;
  [key: string]: SocialMediaCredential;
}

export interface AuthIntegrationRequest {
  userId: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface IAuthUrlResponse {
  authUrl: string;
}

export interface IUpdateSocialPayload {
  status?: "Connected" | "Disconnected" | "Error";
  isActive?: boolean;
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

export interface SocialPlatformStats {
  followers: number;
  engagement: number;
  comments: number;
  posts: number;
  reach: number;
  impressions: number;
  clicks: number;
  username?: string;
  connected: boolean;
  likes: number;
  shares: number;
  views?: number;
}

export interface SocialOverviewResponse {
  overview: {
    totalPosts: number;
    publishedPosts: number;
    totalFollowers: number;
    totalEngagement: number;
    totalComments: number;
    totalLikes: number;
  };
  recentPerformance: {
    totalReach: number;
    totalImpressions: number;
    avgClickRate: string;
  };
  contentCalender: {
    scheduledPosts: number;
    publishedPosts: number;
  };
  platformPerformance: {
    facebook: SocialPlatformStats;
    instagram: SocialPlatformStats;
    linkedin: SocialPlatformStats;
    youtube: SocialPlatformStats;
  };
}

export interface PostAnalyticsResponse {
  stats: {
    totalReach: number;
    totalImpressions: number;
    avgCTR: number;
    totalEngagement: number;
  };
  platformPerformance: Record<string, Partial<SocialPlatformStats>>;
}

export interface PostFile {
  _id: string;
  path: string;
  mimetype: string;
  filename: string;
  size: number;
}

export interface RecentPost {
  _id: string;
  userId: string;
  title: string;
  description: string;
  files: PostFile[];
  platforms: string[];
  status: "Published" | "Scheduled" | "Failed";
  publishedTime: string;
  createdAt: string;
  updatedAt: string;
  failureReason?: string; // Stringified JSON from API
  platformIds: Record<string, { success: boolean; id: string }>;
  postStats: Record<string, any>;
  summary: {
    likes: number;
    comments: number;
    views: number;
    shares: number;
  };
}

export interface RecentPostsResponse {
  stats: {
    likes: number;
    comments: number;
    views: number;
    shares: number;
  };
  posts: RecentPost[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// POST Request Payload (using FormData for file/fields)
export interface CreatePostPayload {
  title: string;
  hashtags: string; // "coding,js"
  platforms: string; // "instagram,facebook"
  description: string;
  scheduledTime: string;
  scheduledDate: string;
  media: string; // "id1,id2"
}

export interface GBPPlatformOverviewResponse {
  views: {
    search: number;
    maps: number;
    total: number;
  };
  actions: {
    calls: number;
    directions: number;
    websiteClicks: number;
    messages: number;
    total: number;
  };
  photos: {
    customer: number;
    business: number;
    total: number;
  };
  reviews: {
    averageRating: number;
    newThisMonth: number;
    total: number;
  };
  topSearchQueries: any[];
}
