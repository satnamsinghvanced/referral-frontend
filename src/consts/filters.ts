export const STATUS_OPTIONS = [
  { label: "Contacted", value: "contacted" },
  { label: "Appointed", value: "appointed" },
  { label: "In Process", value: "inProcess" },
  { label: "Started Treatment", value: "started" },
  { label: "Declined Treatment", value: "declined" },
  { label: "New", value: "new" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Consultation Complete", value: "consultation" },
  { label: "In Treatment", value: "inTreatment" },
  { label: "Completed", value: "completed" },
  { label: "No Show", value: "noShow" },
];

export const urgencyOptions = [
  { key: "all", label: "All Urgencies" },
  { key: "high", label: "High" },
  { key: "medium", label: "Medium" },
  { key: "low", label: "Low" },
];

export const CATEGORY_OPTIONS: {
  _id: string;
  title: string;
  shortTitle: string;
}[] = [
  {
    _id: "A-Level",
    title: "A-Level (High Value Partner)",
    shortTitle: "A-Level",
  },
  { _id: "B-Level", title: "B-Level (Regular Partner)", shortTitle: "B-Level" },
  {
    _id: "C-Level",
    title: "C-Level (Occasional Partner)",
    shortTitle: "C-Level",
  },
  {
    _id: "Other/Prospect",
    title: "Other/Prospect",
    shortTitle: "Other/Prospect",
  },
];

export const PARTNER_FILTERS = [
  { label: "All Practices", value: "allPractices" },
  { label: "A-Level Partners", value: "A-Level" },
  { label: "B-Level Partners", value: "B-Level" },
  { label: "C-Level Partners", value: "C-Level" },
  { label: "Has Notes", value: "hasNotes" },
  { label: "Has Pending Tasks", value: "hasPendingTasks" },
  { label: "Overdue Tasks", value: "overdueTasks" },
  { label: "No Activity", value: "noActivity" },
];

export const PARTNER_SORT_OPTIONS = [
  { label: "Name", value: "name" },
  { label: "Notes Count", value: "notesCount" },
  { label: "Tasks Count", value: "tasksCount" },
  { label: "Referrals", value: "totalReferrals" },
  // { label: "Last Contact", value: "lastContact" },
];

export const CALL_TYPE_OPTIONS = [
  { label: "All types", value: "all" },
  { label: "Inbound", value: "inbound" },
  { label: "Outbound", value: "outbound" },
  { label: "Missed", value: "missed" },
];

export const CALL_STATUS_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Recorded", value: "recorded" },
  { label: "Voicemail", value: "voicemail" },
];

export const TASK_STATUS_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Not Started", value: "notStarted" },
  { label: "In Progress", value: "inProgress" },
  { label: "Completed", value: "completed" },
  { label: "No Longer Needed", value: "noLongerNeeded" },
];