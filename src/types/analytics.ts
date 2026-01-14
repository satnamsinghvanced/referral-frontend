// --- General Analytics ---
export interface ReferralSource {
  name: string;
  value: number;
}

export interface PerformanceData {
  month: string;
  referrals: number;
  conversions: number;
}

export interface WeeklyActivity {
  day: string;
  calls: number;
  reviews: number;
}

export interface GrowthMetric {
  totalReferrals?: number;
  totalAppointments?: number;
  totalRevenue?: number;
  growthPercent: string | number;
}

export interface GeneralAnalyticsResponse {
  referralSources: ReferralSource[];
  performanceData: PerformanceData[];
  weeklyActivity: WeeklyActivity[];
  monthlyReferrals: GrowthMetric;
  appointments: GrowthMetric;
  revenue: GrowthMetric;
  conversionRate: string;
}

// --- Google Analytics ---
export interface TrafficTrend {
  month: string;
  users: number;
  sessions: number;
  pageViews: number;
}

export interface DeviceAnalytic {
  device: "desktop" | "mobile";
  users: number;
}

export interface TopPage {
  path: string;
  views: number;
  users: number;
  avgSessionDuration: number;
  bounceRate: number;
}

export interface GoogleAnalyticsResponse {
  donutData: {
    users: { totalUsers: number; growthPercent: string };
    pageViews: { totalPageViews: number; growthPercent: string };
    sessions: { totalSessions: number; growthPercent: string };
    bounceRate: { totalBounceRate: number; growthPercent: string };
  };
  trafficTrends: TrafficTrend[];
  deviceAnalytics: DeviceAnalytic[];
  topPages: TopPage[];
  trafficSources: {
    data: { source: string; sessions: number; percentage: number | string }[];
    pagination: any;
  };
  conversions: { event: string; count: number }[];
}

// --- Ads Integration (Google & Meta) ---
export interface AdStatMetric {
  value: string | number;
  lastMonthChange: number;
}

export interface AdPerformanceTrend {
  month: string;
  clicks: number;
  conversions: number;
  spend: number;
}

export interface AdsIntegrationResponse {
  stats: {
    totalClicks: AdStatMetric;
    conversions: AdStatMetric;
    costPerClick: AdStatMetric;
    clickThroughRate: AdStatMetric;
  };
  performanceTrends: AdPerformanceTrend[];
  spendingTrends: { month: string; spend: number }[];
  campaigns: any[];
  accountStatus?: string;
}
