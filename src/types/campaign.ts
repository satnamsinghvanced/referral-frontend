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

// ------------------------

export type CampaignStatus =
  | "draft"
  | "scheduled"
  | "paused"
  | "archived"
  | "sent"
  | "active";
export type CampaignType = "oneTimeEmail" | "newsletter";
export type CampaignCategory = "referralOutreach" | "newsletters";

export interface ICampaignStats {
  sentCount: number;
  openCount: number;
  clickCount: number;
  conversionCount: number;
  bounceCount: number;
  unsubscribeCount: number;
  openRate: number | string;
  clickRate: number | string;
  conversionRate: number | string;
}

export interface ICampaignSchedule {
  sendImmediately: boolean;
  date?: string;
}

export interface ICampaignTracking {
  trackOpens: boolean;
  trackClicks: boolean;
}

// Used for GET responses where IDs are often populated
export interface ICampaign {
  _id: string;
  userId: string | { _id: string; email: string };
  name: string;
  subjectLine: string;
  type: CampaignType;
  category: CampaignCategory;
  isABTesting: boolean;
  templateId:
    | string
    | { _id: string; name: string; subjectLine: string }
    | null;
  audienceId: string | { _id: string; name: string } | null;
  content: string;
  schedule: ICampaignSchedule;
  tracking: ICampaignTracking;
  status: CampaignStatus;
  stats: ICampaignStats;
  createdAt: string;
  updatedAt: string;
}

// Used for POST/PUT requests
export interface ICampaignPayload extends Partial<
  Omit<ICampaign, "_id" | "stats" | "createdAt" | "updatedAt">
> {
  templateId?: string;
  audienceId?: string;
}

export interface ICampaignFilters {
  page?: number;
  limit?: number;
  status?: CampaignStatus | "";
  category?: CampaignCategory | "";
  search?: string;
}

export interface IDashboardStats {
  stats: {
    total: number;
    active: number;
    sent: number;
    openRate: string;
    clickRate: string;
    conversions: number;
  };
  recentCampaigns: ICampaign[];
}

export type TrendDirection = "up" | "down";

export interface ILastPeriod {
  value: string | number;
  percentage: string | number;
  trend: TrendDirection;
}

export interface IAnalyticsStat {
  title: string;
  totalValue: string | number;
  lastPeriod: ILastPeriod;
}

export interface IPerformanceMetric {
  month: string;
  sent: number;
  opens: number;
  clicks: number;
  conversions?: number; // Optional as not all endpoints return this
}

export interface ILabelValue {
  label: string;
  value?: number;
  percentage?: number;
}

export interface IDeviceMetric {
  device: string;
  opens?: number;
  clicks?: number;
  percentage: number;
}

// Response Types
export interface IAnalyticsOverview {
  stats: IAnalyticsStat[];
  performanceTrend: IPerformanceMetric[];
  audienceBreakdown: ILabelValue[];
  topPerformingCampaigns: any[]; // Adjust based on campaign object if needed
}

export interface IDetailedPerformance {
  detailedPerformanceMetrics: IPerformanceMetric[];
}

export interface IAudienceAnalytics {
  audienceEngagement: ILabelValue[];
}

export interface IDeviceAnalytics {
  devicePerformance: IDeviceMetric[];
}

export interface ICampaignAnalytics {
  name: string;
  stats: {
    sent: number;
    openRate: string;
    clickRate: string;
    conversions: number;
  };
  performanceOverTime: IPerformanceMetric[];
  topLinks: { link: string; clicks: number }[];
  devicesUsed: IDeviceMetric[];
}

export type AnalyticsFilter =
  | "last7days"
  | "last30days"
  | "last90days"
  | "lastyear"
  | string;

export type APIStepType =
  | "send-email"
  | "wait"
  | "condition"
  | "action";
export type UIStepType =
  | "trigger"
  | "email"
  | "wait"
  | "condition"
  | "action"
  | "tag";

export interface FlowStep {
  id: string;
  type: UIStepType;
  title: string;
  description: string;
  config?: any;
  children?: FlowStep[]; // Standard sequential steps
  branches?: {
    yes: FlowStep[];
    no: FlowStep[];
  };
  pills?: string[];
}

export type AutomationStatus = "active" | "inActive" | "draft";

export type TriggerType = "New Referrer Added"; // Expand as needed

export interface IStepConfig {
  subject?: string;
  templateId?: string;
  duration?: number;
  unit?: "Days" | "Hours" | "Weeks";
  conditionType?: "Email Opened" | "Link Clicked";
  tagIds?: string[];
  action?: "add" | "remove";
}

export interface IStepStats {
  sentCount: number;
  openCount: number;
  clickCount: number;
}

export interface IStep {
  _id?: string;
  type: APIStepType;
  config: IStepConfig;
  stats?: IStepStats;
  steps?: IStep[]; // For linear nesting
  yesSteps?: IStep[]; // For branching
  noSteps?: IStep[]; // For branching
  step?: any[]; // Catch-all for API compatibility
}

export interface IAutomation {
  _id: string;
  userId: string;
  name: string;
  description: string;
  type: "system" | "user";
  trigger: {
    type: TriggerType;
    config?: Record<string, any>;
  };
  steps: IStep[];
  status: AutomationStatus;
  stats: {
    subscriberCount: number;
    openCount: number;
    clickCount: number;
    conversionCount: number;
    openRate: number;
    clickRate: number;
    conversionRate: number;
  };
  isSystemTemplate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IAutomationTemplate {
  _id: string;
  name: string;
  description: string;
  totalUses: number;
}

export interface IAutomationPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IAutomationListResponse {
  automations: IAutomation[];
  pagination: IAutomationPagination;
}
