export interface DesignOptions {
  headerColor: string;
  accentColor: string;
  organizationName?: string;
  buttonText?: string;
  secondaryButtonText?: string;
}

export interface CampaignTemplateUser {
  _id: string;
  email: string;
}

export interface CampaignTemplate {
  _id: string;
  userId: string | CampaignTemplateUser;
  name: string;
  description: string;
  category: string;
  subjectLine: string;
  bodyContent: string;
  designOptions: DesignOptions;
  photos: string[];
  videos: string[];
  mainImage: string;
  tags: string[];
  usageCount: number;
  rating: number;
  favoritedBy: string[];
  isSystemTemplate: boolean;
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean; // Returned in list view
  isPopular?: boolean; // Returned in list view
}

export interface CampaignTemplatesResponse {
  templates: CampaignTemplate[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalTemplates: number;
  };
}

export interface CampaignFilters {
  category?: string | undefined;
  filter?: "favorites" | "popular" | "all" | undefined;
  page?: number | undefined;
  limit?: number | undefined;
  search?: string | undefined;
}

// AUDIENCE SEGMENT
export type AudienceType =
  | "Referral Partners"
  | "Patients"
  | "Dental Practices";
export type AudienceStatus = "Active" | "Inactive";

export interface AudienceReferrer {
  _id: string;
  type:
    | "doctor"
    | "communityReferrer"
    | "socialMediaReferrer"
    | "eventReferrer";
  name: string;
  phone: string;
  email: string;
}

export interface AudienceReferral {
  _id: string;
  name: string;
  phone: string;
  email: string;
  status: "new" | "started" | "completed";
}

export interface AudiencePractice {
  _id: string;
  name: string;
  address: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zip: string;
  };
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface AudienceSegment {
  _id: string;
  userId: string;
  name: string;
  description: string;
  type: AudienceType;
  status: AudienceStatus;
  activity?: string | undefined;
  partnerLevel?: string | undefined;
  practiceSize?: string | undefined;
  location?: string | undefined;
  tags: string[];
  referrers: AudienceReferrer[];
  referrals: AudienceReferral[];
  practices: AudiencePractice[];
  createdAt: string;
  updatedAt: string;
}

export interface AudienceFilters {
  search?: string | undefined;
  filter?: AudienceStatus | undefined;
  page?: number | undefined;
  limit?: number | undefined;
}

export interface AudienceResponse {
  audiences: AudienceSegment[];
  pagination: {
    currentPage: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// ------------------------

export interface Template {
  id: number;
  title: string;
  description: string;
  category: string;
  rating: number;
  usages: number;
  tags: string[];
  image: string;
  isPopular: boolean;
}

export interface Segment {
  id: string;
  name: string;
  description: string;
  type: string;
  status: "active" | "inactive";
  contacts: number;
  campaigns: number;
  updatedAt: string;
  tags: string[];
  avgOpenRate: string;
  avgClickRate: string;
  size: number;
}

export interface CampaignMetric {
  id: number;
  rank: number;
  name: string;
  openRate: string;
  clickRate: string;
  conversions: number;
}
