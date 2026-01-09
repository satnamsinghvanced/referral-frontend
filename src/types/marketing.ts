export type ActivityStatus =
  | "scheduled"
  | "active"
  | "in-progress"
  | "completed"
  | "cancelled"
  | "confirmed";
type ActivityPriority = "low" | "medium" | "high" | string;

export interface ActivityType {
  _id: string;
  title: string;
}

export interface ActivityItem {
  _id: string;
  googleId: string;
  createdBy: string;
  title: string;
  type: string;
  colorId: string;
  description: string;
  startDate: string;
  endDate: string;
  time: string;
  priority: ActivityPriority;
  platform: string;
  budget: number;
  reach?: string;
  status: ActivityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  totalData: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface Stats {
  activeCampaigns: number;
  scheduledPosts: number;
  referralActivities: number;
  monthlyROI: string; // e.g., "0%"
  totalReach: number;
  conversions: number;
}

export interface GetActivitiesQuery {
  search?: string;
  type?: string;
  page?: number;
  limit?: number;
}

export interface GetActivitiesResponse {
  stats: Stats;
  data: ActivityItem[];
  pagination: Pagination;
}

export interface ActivityPayload {
  id?: string;
  googleId?: string;
  title: string;
  type: string;
  colorId: string;
  description: string;
  startDate: string;
  endDate: string;
  time?: string;
  priority?: ActivityPriority;
  platform: string;
  budget: number | null;
  status?: ActivityStatus;
}

export type GetActivityDetailResponse = ActivityItem;

export interface DeleteActivityParams {
  activityId: string;
}

export interface DeleteActivityResponse {
  message: string; // e.g., "Activity deleted successfully."
}
