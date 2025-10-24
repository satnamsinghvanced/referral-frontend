export const urgencyLabels = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const treatmentOptions = [
  { key: "braces", label: "Traditional Braces" },
  { key: "invisalign", label: "Invisalign" },
  { key: "retainers", label: "Retainers" },
  { key: "consultation", label: "Initial Consultation" },
  { key: "followup", label: "Follow-up Treatment" },
  { key: "emergency", label: "Emergency Care" },
];

export const urgencyOptions = [
  { key: "low", label: "Low - No rush" },
  { key: "medium", label: "Medium - Within a month" },
  { key: "high", label: "High - As soon as possible" },
  { key: "emergency", label: "Emergency - Immediate care needed" },
];

export const timeOptions = [
  { key: "morning", label: "Morning (8 AM - 12 PM)" },
  { key: "afternoon", label: "Afternoon (12 PM - 5 PM)" },
  { key: "evening", label: "Evening (After 5 PM)" },
  { key: "weekend", label: "Weekend" },
  { key: "flexible", label: "Flexible - Any time" },
];

export const STAFF_ROLES = [
  { title: "Dentist", _id: "Dentist" },
  { title: "Treatment Coordinator", _id: "Treatment Coordinator" },
  { title: "Dental Assistant", _id: "Dental Assistant" },
  { title: "Front Office", _id: "Front Office" },
  { title: "Finance", _id: "Finance" },
  { title: "Office Manager", _id: "Office Manager" },
  { title: "Other", _id: "Other" },
];

export const NOTE_CATEGORIES = ["General", "Referral", "Contact", "Meeting"];
export const TASK_PRIORITIES = ["low", "medium", "high"];

export const TASK_TYPES = [
  { label: "Follow-up", key: "follow-up" },
  { label: "Meeting", key: "meeting" },
  { label: "Call", key: "call" },
  { label: "Email", key: "email" },
  { label: "Visit", key: "visit" },
];

export const TASK_STATUSES = [
  { label: "Not Started", key: "not-started" },
  { label: "In Progress", key: "in-progress" },
  { label: "Completed", key: "completed" },
  { label: "No Longer Needed", key: "no-longer-needed" },
];
