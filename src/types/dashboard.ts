export interface DashboardData {
  totalReferrals: {
    total: number;
    percentage: number;
    status: string;
  };
  totalValue: {
    total: number;
    percentage: number;
    status?: string;
  };
  totalLastMonth: number;
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
