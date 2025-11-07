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
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Pending", value: "pending" },
];

export const PRIORITY_LEVELS = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];
