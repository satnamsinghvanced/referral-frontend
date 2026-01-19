export const REPORT_STATUSES = [
  { label: "Ready", value: "ready" },
  { label: "Processing", value: "processing" },
  { label: "Generating", value: "generating" },
  { label: "Failed", value: "failed" },
];

export const TIME_RANGES = [
  { key: "1day", label: "Today" },
  { key: "7days", label: "Last 7 Days" },
  { key: "30days", label: "Last 30 Days" },
  { key: "90days", label: "Last 90 Days" },
  { key: "quarter", label: "Last Quarter" },
  { key: "yearToDate", label: "Year To Date" },
  { key: "lastYear", label: "Last Year" },
  { key: "custom", label: "Custom Range" },
];

export const CATEGORIES = [
  { key: "referralAnalytics", label: "Referral Analytics" },
  { key: "marketingBudget", label: "Marketing Budget" },
  { key: "socialMediaAnalytics", label: "Social Media Analytics" },
  { key: "reviewAnalytics", label: "Review Analytics" },
  { key: "communicationAnalytics", label: "Communication Analytics" },
];

export const FORMATS = [
  { key: "pdf", label: "PDF" },
  { key: "excel", label: "Excel" },
  { key: "csv", label: "CSV" },
  // { key: "interactive", label: "Interactive Dashboard" },
];

export const FREQUENCIES = [
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "quarterly", label: "Quarterly" },
];
