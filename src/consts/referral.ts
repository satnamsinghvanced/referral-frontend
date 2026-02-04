export const TREATMENT_OPTIONS = [
  { key: "invisalign", label: "Invisalign" },
  { key: "traditionalBraces", label: "Traditional Braces" },
  { key: "clearBraces", label: "Clear Braces" },
  { key: "generalConsultation", label: "General Consultation" },
  { key: "notSure", label: "Not Sure - Need Consultation" },
];

export const URGENCY_OPTIONS = [
  { key: "low", label: "Low - Routine" },
  { key: "medium", label: "Medium - Within a month" },
  { key: "high", label: "High - As soon as possible" },
];

export const SOURCE_OPTIONS = [
  { key: "Direct", label: "Direct Referral" },
  { key: "NFC", label: "NFC Tap" },
  { key: "QR", label: "QR Code" },
  { key: "Phone", label: "Phone Call" },
  { key: "Email", label: "Email" },
  { key: "Other", label: "Other" },
];
export const REFERRER_TYPE_LABELS: Record<string, string> = {
  doctor: "Doctor Referrer",
  patient: "Patient Referrer",
  communityReferrer: "Community Referrer",
  googleReferrer: "Google Referrer",
  socialMediaReferrer: "Social Media Referrer",
  eventReferrer: "Event Referrer",
};
