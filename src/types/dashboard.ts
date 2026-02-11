export interface DashboardData {
  stats: {
    totalReferrals: {
      total: number;
      percentage: number;
      status: string;
    };
    totalValue: {
      total: number;
      percentage: number;
      status: string;
    };
    reviews: {
      avgRating: number;
      totalReviews: number;
      status: string;
    };
    activeCampaigns: {
      percentage: number;
      totalActiveCampaigns: number;
      status: string;
    };
  };
  recentActivity: {
    referral: {
      _id: string;
      referredBy: string;
      sourceId: string;
      addedVia: string;
      type: string;
      name: string;
      phone: string;
      email: string;
      age: number;
      priority: string;
      estValue: number;
      insurance: string;
      treatment: string;
      appointmentTime: string;
      scheduledDate: string;
      reason: string;
      notes: string;
      status: string;
      createdAt: string;
      updatedAt: string;
      referrer?: {
        name: string;
        type: string;
      };
    } | null;
    reviews: {
      reviewer?: {
        displayName: string;
      };
      starRating?: string;
      comment?: string;
      createTime?: string;
    } | null;
    campaigns: {
      _id: string;
      title: string;
      name: string;
      description: string;
      createdAt: string;
      updatedAt: string;
    } | null;
  };
  nfcQrData: {
    totalScans: number;
    activeQRCodes: number;
    conversionRate: number;
  };
  systemStatus: {
    googleCalendar: boolean;
    reviewTracking: boolean;
    nfcSetup: boolean;
  };
}

export type ResultType = "referral" | "referrer";

export interface BaseSearchResult {
  _id: string;
  name: string;
  phone: string;
  email: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  resultType: ResultType;
}

export interface ReferralResult extends BaseSearchResult {
  resultType: "referral";
  referredBy: string;
  sourceId: string | null;
  addedVia: string;
  age: number;
  priority: "low" | "medium" | "high";
  estValue: number;
  treatment: string;
  scheduledDate: string;
  notes: string;
  status: string;
}

export interface ReferrerResult extends BaseSearchResult {
  resultType: "referrer";
  createdBy: string;
  additionalNotes: string;
  staffMembers: string[];
  isActive: boolean;
  referrals: any[];
  nfcUrl: string;
  qrCode: string;
  qrUrl: string;
}

export type SearchResult = ReferralResult | ReferrerResult;

export interface SearchParams {
  q: string;
}
