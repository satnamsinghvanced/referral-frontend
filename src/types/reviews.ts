// --- Overview Types ---
export interface GBPStatItem {
  totalReviews?: number;
  totalReviewsGrowth?: string;
  averageRating?: number;
  averageRatingGrowth?: string;
  nfcInteractions?: number;
  nfcInteractionsGrowth?: string;
  qrScans?: number;
  qrScansGrowth?: string;
}

export interface GBPMonthlyStat {
  name: string;
  reviews: number;
  nfc: number;
  qr: number;
}

export interface GBPOverviewResponse {
  stats: {
    reviews: GBPStatItem;
    rating: GBPStatItem;
    nfc: GBPStatItem;
    qr: GBPStatItem;
  };
  monthlyStats: GBPMonthlyStat[];
}

// --- Location Performance Types ---
export interface LocationPerformance {
  name: string;
  rating: number;
  totalReviews: number;
  digitalInteractions: number;
  nfcTaps: number;
  qrScans: number;
}

export interface LocationStat {
  label: string;
  reviews: number;
  nfcTaps: number;
  qrScans: number;
}

export interface GBPLocationPerformanceResponse {
  performanceByLocation: LocationPerformance[];
  stats: LocationStat[];
}

// --- Recent Reviews Types ---
export interface Reviewer {
  displayName: string;
  profilePhotoUrl: string;
  isAnonymous: boolean;
}

export interface ReviewReply {
  comment: string;
  updateTime: string;
}

export interface GBPReview {
  name: string;
  reviewId: string;
  reviewer: Reviewer;
  starRating: "ZERO" | "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE";
  comment: string;
  createTime: string;
  updateTime: string;
  reviewReply?: ReviewReply;
}

export interface GBPRecentReviewsResponse {
  reviews: GBPReview[];
  stats: {
    totalReviewCount: number;
    averageRating: number;
    nextPageToken: string;
  };
}

// --- Mutation Payload & Response ---
export interface CreateGBPReviewPayload {
  locationId: string;
  reviewerName: string;
  reviewerEmail: string;
  deskId: string;
}

export interface CreateGBPReviewResponse {
  status: string;
  message: string;
  data: {
    reviewId: string;
    googleReviewUrl: string;
    instruction: string;
  };
}
