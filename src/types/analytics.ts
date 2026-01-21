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

export interface AnalyticsStatBase {
  percentage: number;
  status: "increment" | "decrement";
}

export interface ReferralsStat extends AnalyticsStatBase {
  totalReferrals: number;
}

export interface AppointmentsStat extends AnalyticsStatBase {
  totalAppointments: number;
}

export interface RevenueStat extends AnalyticsStatBase {
  totalRevenue: number;
}

export interface ConversionStat extends AnalyticsStatBase {
  conversionRate: number;
}

export interface GeneralAnalyticsStats {
  monthlyReferrals: ReferralsStat;
  appointments: AppointmentsStat;
  revenue: RevenueStat;
  conversionRate: ConversionStat;
}

export interface GeneralAnalyticsResponse {
  stats: GeneralAnalyticsStats;
  referralSources: ReferralSource[];
  performanceData: PerformanceData[];
  weeklyActivity: WeeklyActivity[];
}

// --- Google Analytics ---
export interface TrafficTrend {
  month: string;
  users: number;
  sessions: number;
  pageViews: number;
}

export interface DeviceAnalytic {
  device: string;
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
  stats: {
    users: { totalUsers: number; growthPercent: string };
    pageViews: { totalPageViews: number; growthPercent: string };
    sessions: { totalSessions: number; growthPercent: string };
    avgSessionDuration: {
      totalAvgSessionDuration: number;
      growthPercent: string;
    };
    bounceRate: { totalBounceRate: number; growthPercent: string };
  };
  trafficTrends: TrafficTrend[];
  deviceAnalytics: DeviceAnalytic[];
  topPages: TopPage[];
  trafficSources: {
    data: { source: string; sessions: number; percentage: number }[];
    pagination: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
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
