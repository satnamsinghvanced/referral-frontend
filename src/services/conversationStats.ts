import axios from "./axios";

export interface ConversationStatsParams {
  platform?: "all" | "facebook" | "instagram" | "web" | string | undefined;
  locationId?: string | undefined;
  search?: string | undefined;
  filter?: "all" | "unread" | "starred" | "archived" | "active" | string | undefined;
  status?: string | undefined;
  includeUnassigned?: boolean | string | undefined;
}

export interface ConversationStatsResponse {
  totalCount: number;
  activeCount: number;
  unreadCount: number;
  avgResponseTime: string;
  conversionRate: number;
  activeConversations: number;
  unreadMessages: number;
  activeSubheading?: string;
  unreadSubheading?: string;
  avgResponseTimeSubheading?: string;
  conversionRateSubheading?: string;
}

export const getConversationStats = async (
  params?: ConversationStatsParams
): Promise<ConversationStatsResponse> => {
  const { data } = await axios.get("/conversations/stats", { params });
  return data?.data || data;
};
