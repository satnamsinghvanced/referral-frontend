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

export const categoryOptions: { _id: string; title: string }[] = [
  {
    _id: "A-Level (High Value Partner)",
    title: "A-Level (High Value Partner)",
  },
  { _id: "B-Level (Regular Partner)", title: "B-Level (Regular Partner)" },
  {
    _id: "C-Level (Occasional Partner)",
    title: "C-Level (Occasional Partner)",
  },
  { _id: "Other/Prospect", title: "Other/Prospect" },
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
