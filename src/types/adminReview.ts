
import { FiMessageSquare, FiMic, FiPhone, FiStar, FiUsers } from "react-icons/fi";
import { LuBuilding2, LuTarget } from "react-icons/lu";

export interface ReviewItem {
  id: string;
  title: string;
  content: string;
  module: "conversations" | "voice_notes" | "referrals" | "partners" | "leads" | "reviews" | "calls";
  location: string;
  locationColor: string;
  author: string;
  authorRole?: string;
  timeAgo: string;
  tags: string[];
  priority?: "High" | "Medium" | "Low";
  status: "inReview" | "flagged" | "archived";
  voiceMeta?: {
    duration: string;
    recordedVia: string;
    audioUrl?: string;
  };
  details?: {
    patientName?: string;
    phone?: string;
    email?: string;
    treatment?: string;
    channel?: string;
    platform?: string;
    staffName?: string;
    unreadCount?: number;
    notes?: string;
    rating?: number;
  };
}

export interface AdminReviewPagination {
  totalData: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AdminReviewStats {
  inReview: number;
  flagged: number;
  archived: number;
  highPriority: number;
  total: number;
}

export interface AdminReviewApiResponse {
  items: ReviewItem[];
  tabCounts: Record<string, number>;
  stats: AdminReviewStats;
  pagination: AdminReviewPagination;
}

export interface MobileAdminReviewApiResponse {
  items: ReviewItem[];
  total: number;
  tabCounts: Record<string, number>;
  stats: AdminReviewStats;
}
export const MODULE_TABS = [
  { key: "all", label: "All", icon: null },
  { key: "conversations", label: "Conversations", icon: FiMessageSquare },
  { key: "voice_notes", label: "Voice Notes", icon: FiMic },
  { key: "referrals", label: "Referrals", icon: FiUsers },
  { key: "partners", label: "Partners", icon: LuBuilding2 },
  { key: "leads", label: "Leads", icon: LuTarget },
  { key: "reviews", label: "Reviews", icon: FiStar },
  { key: "calls", label: "Calls", icon: FiPhone },
];