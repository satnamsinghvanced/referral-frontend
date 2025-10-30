export const statusOptions = [
  { key: "all", label: "All Statuses" },
  { key: "contacted", label: "Mark as Contacted" },
  { key: "scheduled", label: "Mark as Scheduled" },
  { key: "completed", label: "Mark as Completed" },
];

export const urgencyOptions = [
  { key: "all", label: "All Urgencies" },
  { key: "high", label: "High" },
  { key: "medium", label: "Medium" },
  { key: "low", label: "Low" },
];

export const locationOptions = [
  { key: "all", label: "All Locations" },
  { key: "downtown", label: "Downtown Orthodontics" },
  { key: "westside", label: "Westside Dental Specialists" },
  { key: "brooklyn", label: "Brooklyn Heights Orthodontics" },
];

export const categoryOptions: {
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

export const practiceOptions = [
  { key: "all", label: "Practice Name" },
  { key: "category", label: "Category" },
  { key: "totalReferrals", label: "Total Referrals" },
  { key: "relationshipScore", label: "Relationship Score" },
  { key: "familyCandidates", label: "Family Candidates" },
];

export const short = [
  { key: "all", label: "Filter" },
  { key: "ascending", label: "Ascending" },
  { key: "descending", label: "Descending" },
];

export const specialtyOptions = [
  "Prosthodontics",
  "Implant Dentistry",
  "Cosmetic Dentistry",
  "Endodontics",
  "Orthodontics",
  "Oral Surgery",
  "Pediatric Dentistry",
  "Teeth Whitening",
  "General Dentistry",
  "Periodontics",
  "Dental Implants",
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
