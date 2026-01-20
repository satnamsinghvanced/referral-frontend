export type ReportCategory =
  | "referralAnalytics"
  | "marketingBudget"
  | "socialMediaAnalytics"
  | "reviewAnalytics"
  | "communicationAnalytics";

export type ReportTimeRange =
  | "1day"
  | "7days"
  | "30days"
  | "90days"
  | "quarter"
  | "lastYear"
  | "yearToDate"
  | "custom";

export type ReportFormat = "pdf" | "excel" | "csv" | "interactive";

export type ReportFrequency = "daily" | "weekly" | "monthly" | "quarterly";

export type ReportStatus = "processing" | "generating" | "ready" | "failed";

export interface Report {
  _id: string;
  userId: string;
  name: string;
  category: ReportCategory;
  timeRange: ReportTimeRange;
  startDate?: string;
  endDate?: string;
  format: ReportFormat;
  schedule: boolean;
  frequency: ReportFrequency;
  fileName?: string;
  fileUrl?: string;
  fileSize?: string;
  mimeType?: string;
  status: ReportStatus;
  exportCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReportStats {
  reportsGenerated: {
    total: number;
    growth: number;
  };
  scheduledReports: {
    total: number;
  };
  exportFormats: {
    count: number;
    types: string[];
  };
  dataSources: {
    count: number;
    status: string;
  };
}

export interface ReportsResponse {
  reports: Report[];
  pagination: {
    totalData: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  stats: ReportStats;
}

export interface GenerateReportPayload {
  name: string;
  category: ReportCategory;
  timeRange: ReportTimeRange;
  startDate?: string;
  endDate?: string;
  format: ReportFormat;
  schedule: boolean;
  frequency?: ReportFrequency;
}
