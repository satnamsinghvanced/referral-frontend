export const PARTNER_LEVELS = [
  { label: "A-Level Partner", value: "A-Level" },
  { label: "B-Level Partner", value: "B-Level" },
  { label: "C-Level Partner", value: "C-Level" },
  { label: "Other/Prospect", value: "Other/Prospect" },
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

export const NOTE_CATEGORIES = [
  { label: "General", value: "general" },
  { label: "Referral", value: "referral" },
  { label: "Contact", value: "contact" },
  { label: "Meeting", value: "meeting" },
];

export const TASK_PRIORITIES = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

export const TASK_TYPES = [
  { label: "Follow-up", key: "follow-up" },
  { label: "Meeting", key: "meeting" },
  { label: "Call", key: "call" },
  { label: "Email", key: "email" },
  { label: "Visit", key: "visit" },
];

export const TASK_STATUSES = [
  { label: "Not Started", value: "not-started" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
  { label: "No Longer Needed", value: "no-longer-needed" },
];

export const PURPOSE_OPTIONS = [
  { title: "Relationship Building", duration: "45 min duration" },
  { title: "Lunch Meeting", duration: "90 min duration" },
  { title: "Case Consultation", duration: "60 min duration" },
  { title: "Education Seminar", duration: "120 min duration" },
  { title: "New Technology Demo", duration: "75 min duration" },
  { title: "Marketing Materials Delivery", duration: "30 min duration" },
  { title: "Feedback Session", duration: "60 min duration" },
  { title: "Staff Training", duration: "90 min duration" },
  { title: "Milestone Celebration", duration: "60 min duration" },
  { title: "Problem Solving", duration: "75 min duration" },
  { title: "Custom Purpose", duration: "Custom" },
];

export const PER_VISIT_DURATION_OPTIONS: string[] = [
  "30 minutes",
  "45 minutes",
  "1 hour",
  "1.5 hour",
  "2 hour",
];

export const VISIT_STATUSES = [
  { label: "Active", value: "active" },
  { label: "In Progress", value: "inProgress" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancel" },
  { label: "Draft", value: "draft" },
];

export const PRIORITY_LEVELS = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

export const STATUS_OPTIONS = [
  { _id: "active", title: "Active" },
  { _id: "inactive", title: "Inactive" },
  { _id: "prospect", title: "Prospect" },
  { _id: "followUp", title: "Follow-up Required" },
];
