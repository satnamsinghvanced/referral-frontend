export const LEAD_SOURCES = [
  { key: "website", label: "Website" },
  { key: "googleAds", label: "Google Ads" },
  { key: "facebookAds", label: "Facebook Ads" },
  { key: "instagram", label: "Instagram" },
  { key: "referral", label: "Referral" },
  { key: "walkIn", label: "Walk-in" },
  { key: "directMail", label: "Direct Mail" },
];

export const LEAD_PRIORITIES = [
  { key: "high", label: "High" },
  { key: "medium", label: "Medium" },
  { key: "low", label: "Low" },
];

export const LEAD_TREATMENTS = [
  { key: "invisalign", label: "Invisalign" },
  { key: "invisalignTeen", label: "Invisalign Teen" },
  { key: "traditionalBraces", label: "Traditional Braces" },
  { key: "clearBraces", label: "Clear Braces" },
  { key: "lingualBraces", label: "Lingual Braces" },
  { key: "surgicalOrthodontics", label: "Surgical Orthodontics" },
  { key: "tmjTreatment", label: "TMJ Treatment" },
  { key: "jawSurgeryConsultation", label: "Jaw Surgery Consultation" },
  { key: "teethWhitening", label: "Teeth Whitening" },
  { key: "veneers", label: "Veneers" },
  { key: "earlyIntervention", label: "Early Intervention" },
  { key: "retainers", label: "Retainers" },
  { key: "emergencyOrthodontics", label: "Emergency Orthodontics" },
];

export const LEAD_STATUSES = [
  { key: "newLead", label: "New Lead" },
  { key: "contacted", label: "Contacted" },
  { key: "appointmentScheduled", label: "Appointment Scheduled" },
  { key: "noShow", label: "No Show" },
  { key: "patientWon", label: "Patient Won" },
  { key: "lost", label: "Patient Lost" },
];

export const STAGE_STYLES: Record<string, any> = {
  new: {
    bg: "bg-sky-50 dark:bg-sky-900/20",
    headerText: "text-sky-700 dark:text-sky-400",
    iconColor: "text-sky-500 dark:text-sky-400",
    bubbleBg: "bg-sky-100/50 dark:bg-sky-800/30",
    border: "border-sky-100/50 dark:border-sky-800/20",
  },
  contacted: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    headerText: "text-blue-700 dark:text-blue-400",
    iconColor: "text-blue-500 dark:text-blue-400",
    bubbleBg: "bg-blue-100/50 dark:bg-blue-800/30",
    border: "border-blue-100/50 dark:border-blue-800/20",
  },
  scheduled: {
    bg: "bg-purple-50 dark:bg-purple-900/20",
    headerText: "text-purple-700 dark:text-purple-400",
    iconColor: "text-purple-500 dark:text-purple-400",
    bubbleBg: "bg-purple-100/50 dark:bg-purple-800/30",
    border: "border-purple-100/50 dark:border-purple-800/20",
  },
  "no-show": {
    bg: "bg-orange-50 dark:bg-orange-900/20",
    headerText: "text-orange-700 dark:text-orange-400",
    iconColor: "text-orange-500 dark:text-orange-400",
    bubbleBg: "bg-orange-100/50 dark:bg-orange-800/30",
    border: "border-orange-100/50 dark:border-orange-800/20",
  },
  won: {
    bg: "bg-green-50 dark:bg-green-900/20",
    headerText: "text-green-700 dark:text-green-400",
    iconColor: "text-green-500 dark:text-green-400",
    bubbleBg: "bg-green-100/50 dark:bg-green-800/30",
    border: "border-green-100/50 dark:border-green-800/20",
  },
  lost: {
    bg: "bg-slate-50 dark:bg-slate-900/20",
    headerText: "text-slate-700 dark:text-slate-400",
    iconColor: "text-slate-500 dark:text-slate-400",
    bubbleBg: "bg-slate-100/50 dark:bg-slate-800/30",
    border: "border-slate-100/50 dark:border-slate-800/20",
  },
};
