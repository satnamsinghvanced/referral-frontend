export const CAMPAIGN_STATUSES = [
  {
    label: "Scheduled",
    value: "scheduled",
  },
  {
    label: "Paused",
    value: "paused",
  },
  {
    label: "Draft",
    value: "draft",
  },
  {
    label: "Active",
    value: "active",
  },
];

export const CAMPAIGN_CATEGORIES = [
  {
    label: "Referral Outreach",
    value: "referralOutreach",
  },
  {
    label: "Patient Follow-up",
    value: "patientFollowUp",
  },
  {
    label: "Newsletters",
    value: "newsletters",
  },
  {
    label: "Announcements",
    value: "announcements",
  },
  {
    label: "Onboarding",
    value: "onboarding",
  },
];

export const CAMPAIGN_TYPES = [
  { value: "oneTimeEmail", label: "One-time Email" },
  { value: "automatedSequence", label: "Automation Series" },
  // { value: "newsletter", label: "Newsletter" },
];

export const FLOW_STATUSES = [
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Paused",
    value: "inActive",
  },
  {
    label: "Draft",
    value: "draft",
  },
];

export const FLOW_CATEGORIES = [
  { label: "Referral", value: "referral" },
  { label: "Patient", value: "patient" },
  { label: "Internal", value: "internal" },
];

export const AUDIENCE_SEGMENT_STATUSES = [
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Inactive",
    value: "inactive",
  },
];

export const AUDIENCE_TYPES = [
  {
    label: "Dental Practices",
    value: "dentalPractices",
  },
  {
    label: "Patients",
    value: "patients",
  },
  {
    label: "Referral Partners",
    value: "referralPartners",
  },
];

export const PRACTICE_SIZES = [
  { label: "Solo Practice (1 doctor)", value: "soloPractice (1 doctor)" },
  { label: "Small Group (2-4 doctors)", value: "smallGroup (2-4 doctors)" },
  { label: "Large Group (5+ doctors)", value: "largeGroup (5+ doctors)" },
];

export const PARTNER_LEVELS = [
  { label: "A-Level", value: "aLevel (10+ referrals/month)" },
  { label: "B-Level", value: "bLevel (5-9 referrals/month)" },
  { label: "C-Level", value: "cLevel (1-4 referrals/month)" },
];

export const ACTIVITY_TIMEFRAMES = [
  { label: "Last 7 days", value: "last7Days" },
  { label: "Last 30 days", value: "last30Days" },
  { label: "Last 90 days", value: "last90Days" },
  { label: "60+ days ago", value: "60+DaysAgo" },
];

export const ANALYTICS_FILTER_OPTIONS = [
  { label: "Last 7 days", value: "last7days" },
  { label: "Last 30 days", value: "last30days" },
  { label: "Last 90 days", value: "last90days" },
  { label: "Last year", value: "lastyear" },
];
