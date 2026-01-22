// --- Common & Base Types ---
export interface ActionResponse {
  status: string;
  message: string;
  success: boolean;
}

export interface UserMinimal {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
}

// --- Referral Export Types ---
export interface ReferralExportItem {
  _id: string;
  referredBy: UserMinimal;
  sourceId: string | null;
  addedVia: string;
  type: string;
  name: string;
  phone: string;
  email: string;
  age: number;
  priority: "low" | "medium" | "high";
  estValue: number;
  treatment: string;
  insurance?: string;
  notes: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  scheduledDate?: string;
  reason?: string;
}

// --- Analytics Export Types ---
export interface AnalyticsExportResponse {
  exportedAt: string;
  user: UserMinimal;
  dashboardAnalytics: {
    success: boolean;
    data: {
      referralSources: { name: string; value: number }[];
      performanceData: {
        month: string;
        referrals: number;
        conversions: number;
      }[];
      stats: {
        monthlyReferrals: {
          totalReferrals: number;
          percentage: number;
          status: string;
        };
        revenue: { totalRevenue: number; percentage: number; status: string };
        conversionRate: {
          conversionRate: number;
          percentage: number;
          status: string;
        };
      };
    };
  };
  googleAnalytics: {
    success: boolean;
    data: {
      stats: Record<
        string,
        { totalUsers?: number; totalPageViews?: number; growthPercent: string }
      >;
      deviceAnalytics: { device: string; users: number }[];
      topPages: { path: string; views: number; users: number }[];
    };
  };
  googleAdsAnalytics: { success: boolean; message: string; data: any };
  metaAdsAnalytics: { success: boolean; data: any };
}

// --- Reviews Export Types ---
export interface ReviewsExportResponse {
  overview: {
    reviews: { totalReviews: number; totalReviewsGrowth: string };
    rating: { averageRating: number; averageRatingGrowth: string };
    nfc: { nfcInteractions: number; nfcInteractionsGrowth: string };
  };
  performanceByLocation: {
    name: string;
    rating: number;
    totalReviews: number;
    nfcTaps: number;
    qrScans: number;
  }[];
  recentReviews: any[];
}
